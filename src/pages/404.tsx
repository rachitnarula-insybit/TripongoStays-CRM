import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-light-gray px-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="p-8">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="mx-auto w-32 h-32 bg-gradient-to-br from-primary-orange to-primary-soft-orange rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold text-white">404</span>
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-2xl font-bold text-neutral-black mb-2">
            Page Not Found
          </h1>
          <p className="text-neutral-gray mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved. 
            Let&apos;s get you back on track.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link href="/dashboard" className="block">
              <Button className="w-full" leftIcon={<Home className="h-4 w-4" />}>
                Go to Dashboard
              </Button>
            </Link>
            <Button
              variant="tertiary"
              className="w-full"
              onClick={() => window.history.back()}
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Go Back
            </Button>
          </div>

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t border-neutral-border-gray">
            <p className="text-sm text-neutral-gray">
              Need help? Contact our support team at{' '}
              <a 
                href="mailto:support@tripongostays.com" 
                className="text-primary-orange hover:underline"
              >
                support@tripongostays.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFoundPage;