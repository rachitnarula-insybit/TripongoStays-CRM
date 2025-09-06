import React from 'react';
import { Filter, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { LeadFilters } from '@/types';

interface LeadFiltersProps {
  filters: LeadFilters;
  onFiltersChange: (filters: LeadFilters) => void;
  onClearFilters: () => void;
}

const LeadFiltersComponent: React.FC<LeadFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const sourceOptions = [
    { value: 'Web', label: 'Website' },
    { value: 'WhatsApp', label: 'WhatsApp' },
    { value: 'Call', label: 'Phone Call' },
    { value: 'Social', label: 'Social Media' },
    { value: 'Referral', label: 'Referral' },
  ];
  
  const statusOptions = [
    { value: 'New', label: 'New Lead' },
    { value: 'Hot', label: 'Hot Lead' },
    { value: 'Follow-up', label: 'Follow-up' },
    { value: 'Converted', label: 'Converted' },
    { value: 'Lost', label: 'Lost' },
  ];
  
  const assignmentOptions = [
    { value: 'unassigned', label: 'Unassigned' },
    { value: 'ai', label: 'Voice Agent (AI)' },
    { value: 'human', label: 'Human Agent' },
  ];

  const handleSourceChange = (source: string) => {
    const currentSources = filters.source || [];
    const newSources = currentSources.includes(source)
      ? currentSources.filter(s => s !== source)
      : [...currentSources, source];
    
    onFiltersChange({
      ...filters,
      source: newSources.length > 0 ? newSources : undefined,
    });
  };

  const handleStatusChange = (status: string) => {
    const currentStatuses = filters.status || [];
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status];
    
    onFiltersChange({
      ...filters,
      status: newStatuses.length > 0 ? newStatuses : undefined,
    });
  };

  const handleAssignmentChange = (assignedTo: string) => {
    const currentAssignments = filters.assignedTo || [];
    const newAssignments = currentAssignments.includes(assignedTo)
      ? currentAssignments.filter(a => a !== assignedTo)
      : [...currentAssignments, assignedTo];
    
    onFiltersChange({
      ...filters,
      assignedTo: newAssignments.length > 0 ? newAssignments : undefined,
    });
  };

  const hasActiveFilters = 
    (filters.source && filters.source.length > 0) ||
    (filters.status && filters.status.length > 0) ||
    (filters.assignedTo && filters.assignedTo.length > 0);

  return (
    <Card className="border-0 shadow-md bg-gradient-to-br from-white to-gray-50/50">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="flex items-center space-x-2 text-gray-800">
          <div className="p-1.5 bg-blue-100 rounded-lg">
            <Filter className="h-4 w-4 text-blue-600" />
          </div>
          <span className="text-lg font-semibold">Smart Filters</span>
        </CardTitle>
        {hasActiveFilters && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onClearFilters}
            leftIcon={<X className="h-4 w-4" />}
          >
            Clear All
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Source Filter */}
          <div>
            <h4 className="text-sm font-medium text-neutral-black mb-3 flex items-center">
              <span>Lead Source</span>
            </h4>
            <div className="space-y-2">
              {sourceOptions.map((source) => (
                <label 
                  key={source.value} 
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={filters.source?.includes(source.value) || false}
                    onChange={() => handleSourceChange(source.value)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 font-medium">{source.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <h4 className="text-sm font-medium text-neutral-black mb-3 flex items-center">
              <span>Lead Status</span>
            </h4>
            <div className="space-y-2">
              {statusOptions.map((status) => (
                <label 
                  key={status.value} 
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={filters.status?.includes(status.value) || false}
                    onChange={() => handleStatusChange(status.value)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 font-medium">{status.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Assignment Filter */}
          <div>
            <h4 className="text-sm font-medium text-neutral-black mb-3 flex items-center">
              <span>Agent Type</span>
            </h4>
            <div className="space-y-2">
              {assignmentOptions.map((option) => (
                <label 
                  key={option.value} 
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={filters.assignedTo?.includes(option.value) || false}
                    onChange={() => handleAssignmentChange(option.value)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 font-medium">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadFiltersComponent;