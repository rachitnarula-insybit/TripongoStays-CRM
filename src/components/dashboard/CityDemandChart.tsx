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
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary-orange border-t-transparent"></div>
              <p className="mt-2 text-sm text-neutral-gray">Loading chart...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

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
        <div className="bg-white p-3 border border-neutral-border-gray rounded-lg shadow-lg">
          <p className="font-medium text-neutral-black">{label}</p>
          <p className="text-primary-orange">
            Bookings: {payload[0].value}
          </p>
          <p className="text-secondary-green">
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
        <CardTitle>City-wise Demand</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
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
                fill="#EC6B2F" 
                radius={[4, 4, 0, 0]}
                className="hover:opacity-80 transition-opacity"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-neutral-light-gray rounded-lg">
            <p className="text-sm text-neutral-gray">Top City</p>
            <p className="font-medium text-neutral-black">
              {data.length > 0 ? data[0].city : 'N/A'}
            </p>
          </div>
          <div className="text-center p-3 bg-neutral-light-gray rounded-lg">
            <p className="text-sm text-neutral-gray">Total Revenue</p>
            <p className="font-medium text-neutral-black">
              {formatCurrency(data.reduce((sum, city) => sum + city.revenue, 0))}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CityDemandChart;