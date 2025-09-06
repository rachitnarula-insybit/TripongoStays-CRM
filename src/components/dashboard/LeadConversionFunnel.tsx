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
          <CardTitle className="text-xl font-black text-blue-900 uppercase tracking-wide">Lead Conversion Funnel</CardTitle>
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
                  <span className="text-sm font-bold text-neutral-900 uppercase tracking-wide">
                    {stage.stage}
                  </span>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-semibold text-blue-700">
                      {stage.count}
                    </span>
                    <span className="text-lg font-black text-blue-900">
                      {stage.percentage}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-blue-100 rounded-full h-4">
                  <div
                    className="h-4 rounded-full transition-all duration-500 ease-out shadow-sm"
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
              <span className="font-bold text-blue-800 uppercase tracking-wide">Conversion Rate:</span>
              <span className="font-black text-2xl text-blue-900">
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