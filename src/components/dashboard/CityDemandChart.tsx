import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatCurrency } from '@/utils';
import { CityDemandData } from '@/types';

interface CityDemandChartProps {
  data: CityDemandData[];
  isLoading?: boolean;
}

const CityDemandChart: React.FC<CityDemandChartProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>City-wise Demand</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-brand-primary-500 border-t-transparent"></div>
              <p className="mt-2 text-sm text-neutral-gray">Loading chart...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Ensure data is an array and handle null/undefined cases
  const safeData = Array.isArray(data) ? data : [];

  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{
      value: number;
      payload: { revenue: number };
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border-2 border-blue-200 rounded-lg shadow-xl">
          <p className="font-black text-blue-900 text-lg uppercase tracking-wide">{label}</p>
          <p className="text-blue-700 font-bold text-lg">
            Bookings: {payload[0].value}
          </p>
          <p className="text-blue-800 font-bold text-lg">
            Revenue: {formatCurrency(payload[0].payload.revenue)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-black text-blue-900 uppercase tracking-wide">City-wise Demand</CardTitle>
      </CardHeader>
      <CardContent>
        {safeData.length > 0 ? (
          <>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={safeData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <defs>
                    <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0EA5E9" />
                      <stop offset="100%" stopColor="#38BDF8" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                  <XAxis 
                    dataKey="city" 
                    tick={{ fontSize: 12, fill: '#666666' }}
                    axisLine={{ stroke: '#E0E0E0' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#666666' }}
                    axisLine={{ stroke: '#E0E0E0' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="bookings" 
                    fill="url(#blueGradient)" 
                    radius={[4, 4, 0, 0]}
                    className="hover:opacity-80 transition-opacity"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-bold text-blue-800 uppercase tracking-wide">Top City</p>
                <p className="font-black text-xl text-blue-900">
                  {safeData[0].city}
                </p>
              </div>
              <div className="text-center p-4 bg-blue-100 rounded-lg border border-blue-300">
                <p className="text-sm font-bold text-blue-800 uppercase tracking-wide">Total Revenue</p>
                <p className="font-black text-xl text-blue-900">
                  {formatCurrency(safeData.reduce((sum, city) => sum + city.revenue, 0))}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="h-80 flex items-center justify-center">
            <div className="text-center">
              <p className="text-neutral-gray">No city demand data available</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CityDemandChart;