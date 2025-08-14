import React from 'react';
import { Phone, MessageCircle, User, Mail, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatDate, getStatusColor, getPriorityColor, openWhatsApp, initiateCall } from '@/utils';
import { Lead } from '@/types';

interface NotContactedLeadsProps {
  leads: Lead[];
  isLoading?: boolean;
}

const NotContactedLeads: React.FC<NotContactedLeadsProps> = ({ leads, isLoading }) => {
  const handleWhatsApp = (lead: Lead) => {
    const message = `Hi ${lead.name}, Thank you for your interest in TripongoStays. I'm here to help you with your booking requirements.`;
    openWhatsApp(lead.phone, message);
  };

  const handleCall = (lead: Lead) => {
    initiateCall(lead.phone);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Not Contacted Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse border border-neutral-border-gray rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-48"></div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="h-8 w-16 bg-gray-200 rounded"></div>
                    <div className="h-8 w-16 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="h-6 w-12 bg-gray-200 rounded"></div>
                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Filter leads that haven't been contacted or are new
  const notContactedLeads = leads.filter(lead => 
    lead.status === 'New' || !lead.lastContactDate
  ).slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Not Contacted Leads</CardTitle>
        <Badge variant="error">
          {notContactedLeads.length} pending
        </Badge>
      </CardHeader>
      <CardContent>
        {notContactedLeads.length === 0 ? (
          <div className="text-center py-8">
            <User className="mx-auto h-12 w-12 text-neutral-gray/50 mb-4" />
            <p className="text-neutral-gray">No pending leads to contact</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notContactedLeads.map((lead) => (
              <div
                key={lead.id}
                className="border border-neutral-border-gray rounded-lg p-4 hover:bg-neutral-light-gray/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-neutral-black">{lead.name}</h4>
                      <Badge 
                        className={getPriorityColor(lead.priority)}
                        size="sm"
                      >
                        {lead.priority}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-neutral-gray">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span>{lead.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="h-3 w-3" />
                        <span>{lead.phone}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>Source: {lead.source}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleWhatsApp(lead)}
                      leftIcon={<MessageCircle className="h-4 w-4" />}
                      className="text-secondary-green border-secondary-green hover:bg-green-50"
                    >
                      WhatsApp
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCall(lead)}
                      leftIcon={<Phone className="h-4 w-4" />}
                      className="text-secondary-blue border-secondary-blue hover:bg-blue-50"
                    >
                      Call
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Badge className={getStatusColor(lead.status)} size="sm">
                      {lead.status}
                    </Badge>
                    <Badge variant="info" size="sm">
                      {lead.source}
                    </Badge>
                  </div>
                  <span className="text-xs text-neutral-gray">
                    Created {formatDate(String(lead.createdDate))}
                  </span>
                </div>
                
                {lead.notes && (
                  <div className="mt-2 p-2 bg-neutral-light-gray rounded text-sm text-neutral-gray">
                    <strong>Notes:</strong> {lead.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotContactedLeads;