import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Phone, MessageCircle, ChevronDown } from 'lucide-react';
import { leadsApi } from '@/services/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Table from '@/components/ui/Table';
import Pagination from '@/components/ui/Pagination';
import Badge from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import LeadFiltersComponent from '@/components/leads/LeadFilters';
import { Lead, TableColumn, LeadFilters } from '@/types';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<LeadFilters>({});
  
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
  }, [localLeads, leadsResponse?.data, searchTerm, sortKey, sortDirection]);

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

  const handleAssignLead = (leadId: string, assignedTo: string) => {
    setLocalLeads(prev => 
      prev.map(lead => 
        lead.id === leadId 
          ? { ...lead, assignedTo }
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

  const StatusDropdown: React.FC<{ lead: Lead }> = ({ lead }) => {
    const [isOpen, setIsOpen] = useState(false);
    const statusOptions: Lead['status'][] = ['New', 'Hot', 'Follow-up', 'Converted', 'Lost'];

    return (
      <div className="relative">
        <Button
          variant="outline"
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
    const agents = [
      { id: '2', name: 'Priya Sharma' },
      { id: '3', name: 'Rahul Kumar' },
      { id: '4', name: 'Sneha Patel' },
    ];

    const assignedAgent = agents.find(agent => agent.id === lead.assignedTo);

    return (
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          rightIcon={<ChevronDown className="h-3 w-3" />}
          className="min-w-[120px] justify-between"
        >
          {assignedAgent ? assignedAgent.name : 'Unassigned'}
        </Button>
        
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-neutral-border-gray rounded-lg shadow-lg z-10">
            <button
              className="w-full px-3 py-2 text-left text-sm hover:bg-neutral-light-gray first:rounded-t-lg"
              onClick={() => {
                handleAssignLead(lead.id, '');
                setIsOpen(false);
              }}
            >
              Unassigned
            </button>
            {agents.map((agent) => (
              <button
                key={agent.id}
                className="w-full px-3 py-2 text-left text-sm hover:bg-neutral-light-gray last:rounded-b-lg"
                onClick={() => {
                  handleAssignLead(lead.id, agent.id);
                  setIsOpen(false);
                }}
              >
                {agent.name}
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
          <div className="text-sm text-neutral-gray">{lead.email}</div>
          <div className="text-sm text-neutral-gray">{lead.phone}</div>
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
      render: (_, lead) => <StatusDropdown lead={lead} />,
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
      render: (_, lead) => <AssignmentDropdown lead={lead} />,
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
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleWhatsApp(lead)}
            leftIcon={<MessageCircle className="h-3 w-3" />}
            className="text-secondary-green border-secondary-green hover:bg-green-50"
          >
            WhatsApp
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleCall(lead)}
            leftIcon={<Phone className="h-3 w-3" />}
            className="text-secondary-blue border-secondary-blue hover:bg-blue-50"
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
            variant="outline"
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
          <h1 className="text-2xl font-bold text-neutral-black">Leads</h1>
          <p className="text-neutral-gray">Manage and track your sales leads</p>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search leads..."
            leftIcon={<Search className="h-4 w-4" />}
            onChange={handleSearch}
            className="w-64"
          />
        </div>
      </div>

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
    </div>
  );
};

export default LeadsPage;