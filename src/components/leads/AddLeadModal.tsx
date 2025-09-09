import React, { useState } from 'react';
import { X, User, Mail, Phone, Globe, FileText, Star, Save } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { LeadFormData } from '@/types';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (leadData: LeadFormData) => void;
}

const AddLeadModal: React.FC<AddLeadModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    email: '',
    phone: '',
    source: 'Web',
    notes: '',
    priority: 'Medium'
  });

  const [errors, setErrors] = useState<Partial<LeadFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const sourceOptions: { value: LeadFormData['source']; label: string; color: string }[] = [
    { value: 'Web', label: 'Website', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { value: 'WhatsApp', label: 'WhatsApp', color: 'bg-green-100 text-green-800 border-green-200' },
    { value: 'Call', label: 'Phone Call', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { value: 'Social', label: 'Social Media', color: 'bg-pink-100 text-pink-800 border-pink-200' },
    { value: 'Referral', label: 'Referral', color: 'bg-orange-100 text-orange-800 border-orange-200' }
  ];

  const priorityOptions: { value: LeadFormData['priority']; label: string; color: string }[] = [
    { value: 'High', label: 'High Priority', color: 'bg-red-100 text-red-800 border-red-200' },
    { value: 'Medium', label: 'Medium Priority', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { value: 'Low', label: 'Low Priority', color: 'bg-gray-100 text-gray-800 border-gray-200' }
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<LeadFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\+]?[\d\s\-\(\)]{10,}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSave(formData);
      handleClose();
    } catch (error) {
      console.error('Error saving lead:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      source: 'Web',
      notes: '',
      priority: 'Medium'
    });
    setErrors({});
    onClose();
  };

  const handleInputChange = (field: keyof LeadFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Add New Lead</h2>
              <p className="text-base text-gray-600">Create a new lead and start tracking their journey</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="hover:bg-white/50"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-gray-900 flex items-center">
              <User className="h-6 w-6 mr-2 text-blue-500" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-base font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <Input
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={errors.name}
                  leftIcon={<User className="h-4 w-4" />}
                />
              </div>
              
              <div>
                <label className="block text-base font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <Input
                  placeholder="+91 99999 99999"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  error={errors.phone}
                  leftIcon={<Phone className="h-4 w-4" />}
                />
              </div>
            </div>

            <div>
              <label className="block text-base font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <Input
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={errors.email}
                leftIcon={<Mail className="h-4 w-4" />}
              />
            </div>
          </div>

          {/* Lead Details */}
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-gray-900 flex items-center">
              <Globe className="h-6 w-6 mr-2 text-green-500" />
              Lead Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Source
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {sourceOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleInputChange('source', option.value)}
                      className={`p-3 rounded-lg border-2 transition-all text-base font-medium ${
                        formData.source === option.value
                          ? option.color + ' border-current'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <div className="space-y-2">
                  {priorityOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleInputChange('priority', option.value)}
                      className={`w-full p-2 rounded-lg border-2 transition-all text-base font-medium flex items-center justify-between ${
                        formData.priority === option.value
                          ? option.color + ' border-current'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span>{option.label}</span>
                      {formData.priority === option.value && (
                        <Star className="h-4 w-4 fill-current" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-base font-medium text-gray-700 mb-1 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-purple-500" />
              Notes (Optional)
            </label>
            <textarea
              placeholder="Add any additional notes about this lead..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-base text-gray-500">
              * Required fields
            </div>
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                leftIcon={<Save className="h-4 w-4" />}
                isLoading={isLoading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {isLoading ? 'Saving...' : 'Save Lead'}
              </Button>
            </div>
          </div>
        </form>

        {/* Success Preview */}
        {formData.name && formData.email && formData.phone && (
          <div className="mx-6 mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="p-1 bg-green-100 rounded">
                <User className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-medium text-green-800">Preview</h4>
                <div className="mt-1 text-base text-green-700">
                  <div><strong>{formData.name}</strong></div>
                  <div>{formData.email} • {formData.phone}</div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge 
                      className={sourceOptions.find(s => s.value === formData.source)?.color} 
                      size="sm"
                    >
                      {sourceOptions.find(s => s.value === formData.source)?.label}
                    </Badge>
                    <Badge 
                      className={priorityOptions.find(p => p.value === formData.priority)?.color} 
                      size="sm"
                    >
                      {formData.priority} Priority
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AddLeadModal;
