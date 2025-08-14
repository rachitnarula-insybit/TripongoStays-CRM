import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
import { dashboardApi, leadsApi } from '@/services/api';
import Button from '@/components/ui/Button';
import StatsCards from '@/components/dashboard/StatsCards';
import LeadConversionFunnel from '@/components/dashboard/LeadConversionFunnel';
import CityDemandChart from '@/components/dashboard/CityDemandChart';
import NotContactedLeads from '@/components/dashboard/NotContactedLeads';

const DashboardPage: React.FC = () => {
  const {
    data: statsData,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardApi.getStats,
  });

  const {
    data: conversionData,
    isLoading: conversionLoading,
    refetch: refetchConversion,
  } = useQuery({
    queryKey: ['lead-conversion'],
    queryFn: dashboardApi.getLeadConversion,
  });

  const {
    data: cityDemandData,
    isLoading: cityDemandLoading,
    refetch: refetchCityDemand,
  } = useQuery({
    queryKey: ['city-demand'],
    queryFn: dashboardApi.getCityDemand,
  });

  const {
    data: leadsData,
    isLoading: leadsLoading,
    refetch: refetchLeads,
  } = useQuery({
    queryKey: ['leads', 1, 20],
    queryFn: () => leadsApi.getLeads(1, 20),
  });

  const handleRefresh = async () => {
    await Promise.all([
      refetchStats(),
      refetchConversion(),
      refetchCityDemand(),
      refetchLeads(),
    ]);
  };

  const isRefreshing = statsLoading || conversionLoading || cityDemandLoading || leadsLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-black">Dashboard</h1>
          <p className="text-neutral-gray">Welcome back! Here's what's happening with your business.</p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          isLoading={isRefreshing}
          leftIcon={<RefreshCw className="h-4 w-4" />}
        >
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <StatsCards 
        stats={statsData?.data || {
          totalBookings: 0,
          totalProperties: 0,
          totalLeads: 0,
          revenue: 0,
          revenueGrowth: 0,
          bookingsGrowth: 0,
          leadsGrowth: 0,
          propertiesGrowth: 0,
        }} 
        isLoading={statsLoading} 
      />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LeadConversionFunnel 
          data={conversionData?.data || []} 
          isLoading={conversionLoading} 
        />
        <CityDemandChart 
          data={cityDemandData?.data || []} 
          isLoading={cityDemandLoading} 
        />
      </div>

      {/* Not Contacted Leads */}
      <NotContactedLeads 
        leads={leadsData?.data || []} 
        isLoading={leadsLoading} 
      />
    </div>
  );
};

export default DashboardPage;