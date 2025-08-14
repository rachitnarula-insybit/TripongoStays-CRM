import React, { useState, useEffect } from 'react';
import { ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const InventoryPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const inventoryUrl = 'https://tripongostays-admin.vercel.app/';

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [iframeKey]);

  const handleRefresh = () => {
    setIsLoading(true);
    setHasError(false);
    setIframeKey(prev => prev + 1);
  };

  const handleOpenInNewTab = () => {
    window.open(inventoryUrl, '_blank', 'noopener,noreferrer');
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-black">Inventory Management</h1>
          <p className="text-neutral-gray">Manage properties, rooms, and availability</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            leftIcon={<RefreshCw className="h-4 w-4" />}
          >
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={handleOpenInNewTab}
            leftIcon={<ExternalLink className="h-4 w-4" />}
          >
            Open in New Tab
          </Button>
        </div>
      </div>

      {/* Inventory Interface */}
      <Card className="min-h-[800px]">
        <CardHeader className="bg-neutral-light-gray border-b">
          <CardTitle className="flex items-center justify-between">
            <span>TripongoStays Admin Panel</span>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-secondary-green animate-pulse"></div>
              <span className="text-sm text-neutral-gray">Connected</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 relative">
          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary-orange border-t-transparent mb-4"></div>
                <p className="text-neutral-gray">Loading inventory management system...</p>
                <p className="text-sm text-neutral-gray mt-2">This may take a few moments</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <div className="text-center max-w-md mx-auto p-6">
                <AlertCircle className="mx-auto h-12 w-12 text-secondary-red mb-4" />
                <h3 className="text-lg font-semibold text-neutral-black mb-2">
                  Unable to Load Inventory System
                </h3>
                <p className="text-neutral-gray mb-6">
                  The inventory management system could not be loaded. This might be due to network issues or the external service being temporarily unavailable.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={handleRefresh}
                    leftIcon={<RefreshCw className="h-4 w-4" />}
                  >
                    Try Again
                  </Button>
                  <Button
                    onClick={handleOpenInNewTab}
                    leftIcon={<ExternalLink className="h-4 w-4" />}
                  >
                    Open in New Tab
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Iframe */}
          <iframe
            key={iframeKey}
            src={inventoryUrl}
            className="w-full h-[800px] border-0"
            title="TripongoStays Inventory Management"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
            loading="lazy"
          />
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>About Inventory Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-neutral-black mb-2">Features Available:</h4>
              <ul className="space-y-1 text-sm text-neutral-gray">
                <li>• Property management and configuration</li>
                <li>• Room inventory and availability</li>
                <li>• Pricing and rate management</li>
                <li>• Booking calendar overview</li>
                <li>• Property images and descriptions</li>
                <li>• Amenities and facility management</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-black mb-2">Quick Actions:</h4>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenInNewTab}
                  leftIcon={<ExternalLink className="h-4 w-4" />}
                  className="w-full justify-start"
                >
                  Open in Full Screen
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  leftIcon={<RefreshCw className="h-4 w-4" />}
                  className="w-full justify-start"
                >
                  Refresh Interface
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-neutral-light-gray rounded-lg">
            <p className="text-sm text-neutral-gray">
              <strong>Note:</strong> The inventory management system is integrated from an external platform. 
              For the best experience, consider opening it in a new tab. All changes made in the inventory 
              system will be automatically synchronized with your CRM data.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryPage;