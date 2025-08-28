import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { LeadConversionData } from '@/types';

interface LeadConversionFunnelProps {
  data: LeadConversionData[];
  isLoading?: boolean;
}

const LeadConversionFunnel: React.FC<LeadConversionFunnelProps> = ({ 
  data, 
  isLoading 
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lead Conversion Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="flex justify-between mb-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Ensure data is an array and handle null/undefined cases
  const safeData = Array.isArray(data) ? data : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead Conversion Funnel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {safeData.length > 0 ? (
            safeData.map((stage, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-neutral-black">
                    {stage.stage}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-neutral-gray">
                      {stage.count}
                    </span>
                    <span className="text-sm font-medium text-neutral-black">
                      {stage.percentage}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-neutral-border-gray rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${stage.percentage}%`,
                      backgroundColor: stage.color,
                    }}
                  ></div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-neutral-gray">
              <p>No conversion data available</p>
            </div>
          )}
        </div>
        
        {safeData.length > 0 && (
          <div className="mt-6 p-4 bg-neutral-light-gray rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-gray">Conversion Rate:</span>
              <span className="font-medium text-secondary-green">
                {Math.round((safeData[safeData.length - 1].count / safeData[0].count) * 100)}%
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeadConversionFunnel;