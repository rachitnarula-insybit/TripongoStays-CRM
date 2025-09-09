import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { Search, Phone, MessageCircle, ChevronDown, Eye, Plus } from 'lucide-react';
import { leadsApi } from '@/services/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Table from '@/components/ui/Table';
import Pagination from '@/components/ui/Pagination';
import Badge from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import LeadFiltersComponent from '@/components/leads/LeadFilters';
import AIPriorityActions from '@/components/leads/AIPriorityActions';
import AddLeadModal from '@/components/leads/AddLeadModal';
import { Lead, TableColumn, LeadFilters, LeadFormData } from '@/types';
import { 
  formatDate, 
  formatCurrency, 
  debounce, 
  filterBySearch, 
  getStatusColor, 
  getPriorityColor,
  openWhatsApp,
  initiateCall 
} from '@/utils';

const LeadsPage: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<LeadFilters>({});
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  
  // Local state for managing lead updates (no API calls)
  const [localLeads, setLocalLeads] = useState<Lead[]>([]);

  const limit = 10;

  const {
    data: leadsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['leads', currentPage, limit, filters],
    queryFn: () => leadsApi.getLeads(currentPage, limit, filters),
  });

  // Update local leads when API data changes
  useMemo(() => {
    if (leadsResponse?.data && Array.isArray(leadsResponse.data)) {
      setLocalLeads(leadsResponse.data);
    }
  }, [leadsResponse?.data]);

  const pagination = leadsResponse?.pagination;

  // Filter and sort leads - FIXED with safety checks
  const filteredAndSortedLeads = useMemo(() => {
    const leads = localLeads.length > 0 ? localLeads : (leadsResponse?.data || []);
    // Ensure leads is an array
    const safeLeads = Array.isArray(leads) ? leads : [];
    
    let result = filterBySearch(safeLeads, searchTerm, ['name', 'email', 'phone', 'source', 'status']);
    
    // Apply custom filters
    if (filters.source && filters.source.length > 0) {
      result = result.filter(lead => filters.source!.includes(lead.source));
    }
    
    if (filters.status && filters.status.length > 0) {
      result = result.filter(lead => filters.status!.includes(lead.status));
    }
    
    if (filters.assignedTo && filters.assignedTo.length > 0) {
      result = result.filter(lead => {
        return filters.assignedTo!.some(filterType => {
          if (filterType === 'unassigned') {
            return !lead.assignedTo;
          } else if (filterType === 'ai') {
            return lead.assignmentType === 'AI';
          } else if (filterType === 'human') {
            return lead.assignmentType === 'Human';
          }
          return false;
        });
      });
    }
    
    if (sortKey) {
      result = result.sort((a, b) => {
        const aValue = a[sortKey as keyof Lead];
        const bValue = b[sortKey as keyof Lead];
        
        // Handle null/undefined values
        if (aValue === null || aValue === undefined) return sortDirection === 'asc' ? 1 : -1;
        if (bValue === null || bValue === undefined) return sortDirection === 'asc' ? -1 : 1;
        
        // Handle different types of values
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc' 
            ? aValue - bValue
            : bValue - aValue;
        }
        
        // For dates (assuming ISO strings for dates)
        if (sortKey === 'createdDate') {
          const dateA = new Date(String(aValue)).getTime();
          const dateB = new Date(String(bValue)).getTime();
          return sortDirection === 'asc'
            ? dateA - dateB
            : dateB - dateA;
        }
        
        // Fallback for other types
        const compareA = String(aValue);
        const compareB = String(bValue);
        return sortDirection === 'asc'
          ? compareA.localeCompare(compareB)
          : compareB.localeCompare(compareA);
      });
    }
    
    return result;
  }, [localLeads, leadsResponse?.data, searchTerm, sortKey, sortDirection, filters.assignedTo, filters.source, filters.status]);

  const debouncedSearch = debounce((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, 300);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortKey(key);
    setSortDirection(direction);
  };

  const handleFiltersChange = (newFilters: LeadFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  // Local update functions (no API calls)
  const handleStatusChange = (leadId: string, newStatus: Lead['status']) => {
    setLocalLeads(prev => 
      prev.map(lead => 
        lead.id === leadId 
          ? { ...lead, status: newStatus }
          : lead
      )
    );
  };


  const handleWhatsApp = (lead: Lead) => {
    const message = `Hi ${lead.name}, Thank you for your interest in TripongoStays. I'm here to help you with your booking requirements.`;
    openWhatsApp(lead.phone, message);
  };

  const handleCall = (lead: Lead) => {
    initiateCall(lead.phone);
  };

  const handleViewProfile = (lead: Lead) => {
    router.push(`/profile/${lead.id}?type=id`);
  };

  const handleAddLead = (leadData: LeadFormData) => {
    // Generate a new lead with a unique ID
    const newLead: Lead = {
      id: `new-${Date.now()}`,
      name: leadData.name,
      email: leadData.email,
      phone: leadData.phone,
      source: leadData.source,
      status: 'New',
      assignedTo: 'ai-agent', // Auto-assign to AI initially
      assignmentType: 'AI',
      createdDate: new Date().toISOString(),
      priority: leadData.priority,
      notes: leadData.notes,
      expectedRevenue: 0
    };

    // Add to local leads
    setLocalLeads(prev => [newLead, ...prev]);
    
    console.log('New lead added:', newLead);
  };

  const StatusDropdown: React.FC<{ lead: Lead }> = ({ lead }) => {
    const [isOpen, setIsOpen] = useState(false);
    const statusOptions: Lead['status'][] = ['New', 'Hot', 'Follow-up', 'Converted', 'Lost'];

    return (
      <div className="relative">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          rightIcon={<ChevronDown className="h-3 w-3" />}
          className="min-w-[100px] justify-between"
        >
          <Badge className={getStatusColor(lead.status)} size="sm">
            {lead.status}
          </Badge>
        </Button>
        
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-neutral-border-gray rounded-lg shadow-lg z-10">
            {statusOptions.map((status) => (
              <button
                key={status}
                className="w-full px-3 py-2 text-left text-sm hover:bg-neutral-light-gray first:rounded-t-lg last:rounded-b-lg"
                onClick={() => {
                  handleStatusChange(lead.id, status);
                  setIsOpen(false);
                }}
              >
                <Badge className={getStatusColor(status)} size="sm">
                  {status}
                </Badge>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const AssignmentDropdown: React.FC<{ lead: Lead }> = ({ lead }) => {
    const [isOpen, setIsOpen] = useState(false);
    const assignmentTypes = [
      { type: 'unassigned', label: 'Unassigned', color: 'text-gray-600' },
      { type: 'AI', label: 'Voice Agent (AI)', color: 'text-purple-600' },
      { type: 'Human', label: 'Human Agent', color: 'text-blue-600' },
    ];

    const getCurrentAssignmentLabel = () => {
      if (!lead.assignedTo) {
        return 'Unassigned';
      }
      return lead.assignmentType === 'AI' ? 'Voice Agent (AI)' : 'Human Agent';
    };

    const getCurrentAssignmentColor = () => {
      if (!lead.assignedTo) {
        return 'text-gray-600';
      }
      return lead.assignmentType === 'AI' ? 'text-purple-600' : 'text-blue-600';
    };

    const handleAssignmentTypeChange = (type: string) => {
      if (type === 'unassigned') {
        // Update both assignedTo and assignmentType
        setLocalLeads(prev => 
          prev.map(l => 
            l.id === lead.id 
              ? { ...l, assignedTo: null, assignmentType: 'AI' as const }
              : l
          )
        );
      } else {
        // Assign to AI or Human - we'll use a generic ID for now
        const assignedToId = type === 'AI' ? 'ai-agent' : 'human-agent';
        setLocalLeads(prev => 
          prev.map(l => 
            l.id === lead.id 
              ? { ...l, assignedTo: assignedToId, assignmentType: type as 'AI' | 'Human' }
              : l
          )
        );
      }
    };

    return (
      <div className="relative">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          rightIcon={<ChevronDown className="h-3 w-3" />}
          className={`min-w-[140px] justify-between ${getCurrentAssignmentColor()}`}
        >
          {getCurrentAssignmentLabel()}
        </Button>
        
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-neutral-border-gray rounded-lg shadow-lg z-10">
            {assignmentTypes.map((assignment) => (
              <button
                key={assignment.type}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-neutral-light-gray first:rounded-t-lg last:rounded-b-lg ${assignment.color}`}
                onClick={() => {
                  handleAssignmentTypeChange(assignment.type);
                  setIsOpen(false);
                }}
              >
                {assignment.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const columns: TableColumn<Lead>[] = [
    {
      key: 'name',
      label: 'Lead Name',
      sortable: true,
      render: (value, lead) => (
        <div>
          <div className="font-medium text-neutral-black">{value}</div>
          <div className="text-sm text-neutral-gray">{lead?.email}</div>
          <div className="text-sm text-neutral-gray">{lead?.phone}</div>
        </div>
      ),
    },
    {
      key: 'source',
      label: 'Source',
      sortable: true,
      render: (value) => (
        <Badge variant="info" size="sm">
          {String(value)}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (_, lead) => lead ? <StatusDropdown lead={lead} /> : null,
    },
    {
      key: 'priority',
      label: 'Priority',
      sortable: true,
      render: (value) => (
        <Badge className={getPriorityColor(String(value))} size="sm">
          {String(value)}
        </Badge>
      ),
    },
    {
      key: 'assignedTo',
      label: 'Assigned To',
      render: (_, lead) => lead ? <AssignmentDropdown lead={lead} /> : null,
    },
    {
      key: 'expectedRevenue',
      label: 'Expected Revenue',
      sortable: true,
      render: (value) => value ? formatCurrency(Number(value)) : '-',
    },
    {
      key: 'createdDate',
      label: 'Created Date',
      sortable: true,
      render: (value) => formatDate(String(value)),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, lead) => (
        <div className="flex space-x-1.5 min-w-0">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => lead && handleViewProfile(lead)}
            leftIcon={<Eye className="h-3 w-3" />}
            className="text-gray-600 border-gray-300 hover:bg-gray-50 flex-shrink-0"
          >
            Profile
          </Button>
          <Button
            size="sm"
            variant="success"
            onClick={() => lead && handleWhatsApp(lead)}
            leftIcon={<MessageCircle className="h-3 w-3" />}
            className="flex-shrink-0"
          >
            WhatsApp
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => lead && handleCall(lead)}
            leftIcon={<Phone className="h-3 w-3" />}
            className="text-blue-600 border-blue-300 hover:bg-blue-50 hover:border-blue-400 flex-shrink-0"
          >
            Call
          </Button>
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-secondary-red">Failed to load leads</p>
          <Button
            variant="secondary"
            onClick={() => window.location.reload()}
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-neutral-black">Leads</h1>
          <p className="text-lg text-neutral-gray">Manage and track your sales leads</p>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search leads..."
            leftIcon={<Search className="h-4 w-4" />}
            onChange={handleSearch}
            className="w-64"
          />
          <Button
            onClick={() => setIsAddLeadModalOpen(true)}
            leftIcon={<Plus className="h-4 w-4" />}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium"
          >
            Add Lead
          </Button>
        </div>
      </div>

      {/* AI Priority Actions */}
      <AIPriorityActions />

      {/* Filters */}
      <LeadFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      {/* Leads Table */}
      <Card>
        <CardContent className="p-0">
          <Table
            data={filteredAndSortedLeads}
            columns={columns}
            onSort={handleSort}
            sortKey={sortKey}
            sortDirection={sortDirection}
            isLoading={isLoading}
            emptyMessage="No leads found"
          />
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Add Lead Modal */}
      <AddLeadModal
        isOpen={isAddLeadModalOpen}
        onClose={() => setIsAddLeadModalOpen(false)}
        onSave={handleAddLead}
      />
    </div>
  );
};

export default LeadsPage;