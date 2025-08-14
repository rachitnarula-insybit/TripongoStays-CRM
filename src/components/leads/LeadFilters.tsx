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
  const sourceOptions = ['Web', 'WhatsApp', 'Call', 'Social', 'Referral'];
  const statusOptions = ['New', 'Hot', 'Follow-up', 'Converted', 'Lost'];
  const assignmentOptions = [
    { value: 'unassigned', label: 'Unassigned' },
    { value: '2', label: 'Priya Sharma' },
    { value: '3', label: 'Rahul Kumar' },
    { value: '4', label: 'Sneha Patel' },
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <Filter className="h-5 w-5" />
          <span>Filters</span>
        </CardTitle>
        {hasActiveFilters && (
          <Button
            variant="outline"
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
            <h4 className="text-sm font-medium text-neutral-black mb-3">Source</h4>
            <div className="space-y-2">
              {sourceOptions.map((source) => (
                <label key={source} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.source?.includes(source) || false}
                    onChange={() => handleSourceChange(source)}
                    className="rounded border-neutral-border-gray text-primary-orange focus:ring-primary-orange"
                  />
                  <span className="text-sm text-neutral-gray">{source}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <h4 className="text-sm font-medium text-neutral-black mb-3">Status</h4>
            <div className="space-y-2">
              {statusOptions.map((status) => (
                <label key={status} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.status?.includes(status) || false}
                    onChange={() => handleStatusChange(status)}
                    className="rounded border-neutral-border-gray text-primary-orange focus:ring-primary-orange"
                  />
                  <span className="text-sm text-neutral-gray">{status}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Assignment Filter */}
          <div>
            <h4 className="text-sm font-medium text-neutral-black mb-3">Assigned To</h4>
            <div className="space-y-2">
              {assignmentOptions.map((option) => (
                <label key={option.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.assignedTo?.includes(option.value) || false}
                    onChange={() => handleAssignmentChange(option.value)}
                    className="rounded border-neutral-border-gray text-primary-orange focus:ring-primary-orange"
                  />
                  <span className="text-sm text-neutral-gray">{option.label}</span>
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