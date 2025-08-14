import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { User } from '@/types';

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  role: z.enum(['admin', 'agent', 'manager'] as const),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => Promise<void>;
  user?: User | null;
  isLoading?: boolean;
}

const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  user,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: user ? {
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    } : {
      name: '',
      email: '',
      phone: '',
      role: 'agent',
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      reset(user ? {
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      } : {
        name: '',
        email: '',
        phone: '',
        role: 'agent',
      });
    }
  }, [isOpen, user, reset]);

  const handleFormSubmit = async (data: UserFormData) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? 'Edit User' : 'Add New User'}
      size="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="Enter full name"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="Enter email address"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Phone Number"
          placeholder="Enter phone number"
          error={errors.phone?.message}
          {...register('phone')}
        />

        <div>
          <label className="block text-sm font-medium text-neutral-gray mb-1">
            Role
          </label>
          <select
            className="w-full rounded-lg border border-neutral-border-gray px-3 py-2 text-sm focus:border-primary-orange focus:outline-none focus:ring-2 focus:ring-primary-orange/20"
            {...register('role')}
          >
            <option value="agent">Agent</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
          {errors.role && (
            <p className="mt-1 text-sm text-secondary-red">{errors.role.message}</p>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting || isLoading}
          >
            {user ? 'Update User' : 'Create User'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UserModal;