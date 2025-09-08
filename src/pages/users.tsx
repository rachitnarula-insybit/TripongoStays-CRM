import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Edit, Trash2, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { usersApi } from '@/services/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Table from '@/components/ui/Table';
import Pagination from '@/components/ui/Pagination';
import Badge from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import UserModal from '@/components/users/UserModal';
import { User, CreateUserData, TableColumn } from '@/types';
import { formatDate, debounce, filterBySearch } from '@/utils';

const UsersPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const queryClient = useQueryClient();
  const limit = 10;

  const {
    data: usersResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['users', currentPage, limit],
    queryFn: () => usersApi.getUsers(currentPage, limit),
  });

  const createUserMutation = useMutation({
    mutationFn: usersApi.createUser,
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || 'User created successfully');
        queryClient.invalidateQueries({ queryKey: ['users'] });
      } else {
        toast.error(response.message || 'Failed to create user');
      }
    },
    onError: () => {
      toast.error('An error occurred while creating user');
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      usersApi.updateUser(id, data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || 'User updated successfully');
        queryClient.invalidateQueries({ queryKey: ['users'] });
      } else {
        toast.error(response.message || 'Failed to update user');
      }
    },
    onError: () => {
      toast.error('An error occurred while updating user');
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: usersApi.deleteUser,
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || 'User deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['users'] });
      } else {
        toast.error(response.message || 'Failed to delete user');
      }
    },
    onError: () => {
      toast.error('An error occurred while deleting user');
    },
  });

  const pagination = usersResponse?.pagination;

  // Filter and sort users - FIXED with safety checks
  const filteredAndSortedUsers = useMemo(() => {
    const users = usersResponse?.data || [];
    // Ensure users is an array
    const safeUsers = Array.isArray(users) ? users : [];
    
    let result = filterBySearch(safeUsers, searchTerm, ['name', 'email', 'phone', 'role']);
    
    if (sortKey) {
      result = result.sort((a, b) => {
        const aValue = a[sortKey as keyof User];
        const bValue = b[sortKey as keyof User];
        
        // Handle null/undefined values
        if (aValue === null || aValue === undefined) return sortDirection === 'asc' ? 1 : -1;
        if (bValue === null || bValue === undefined) return sortDirection === 'asc' ? -1 : 1;
        
        // Handle different types of values
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc' 
            ? aValue - bValue
            : bValue - aValue;
        }
        
        // Handle boolean values
        if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
          return sortDirection === 'asc' 
            ? (aValue === bValue ? 0 : aValue ? 1 : -1)
            : (aValue === bValue ? 0 : aValue ? -1 : 1);
        }
        
        // For dates (assuming ISO strings for dates)
        if (sortKey === 'joinedDate') {
          const dateA = new Date(String(aValue)).getTime();
          const dateB = new Date(String(bValue)).getTime();
          return sortDirection === 'asc'
            ? dateA - dateB
            : dateB - dateA;
        }
        
        // Fallback for other types
        const compareA = String(aValue);
        const compareB = String(bValue);
        return sortDirection === 'asc'
          ? compareA.localeCompare(compareB)
          : compareB.localeCompare(compareA);
      });
    }
    
    return result;
  }, [usersResponse?.data, searchTerm, sortKey, sortDirection]);

  const debouncedSearch = debounce((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, 300);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortKey(key);
    setSortDirection(direction);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (user: User) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      deleteUserMutation.mutate(user.id);
    }
  };

  const handleModalSubmit = async (data: CreateUserData | Partial<User>) => {
    if (selectedUser) {
      await updateUserMutation.mutateAsync({
        id: selectedUser.id,
        data: data as Partial<User>,
      });
    } else {
      await createUserMutation.mutateAsync(data as CreateUserData);
    }
  };

  const columns: TableColumn<User>[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value, user) => (
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft-orange text-white text-sm font-medium">
            {user?.name?.charAt(0) || '?'}
          </div>
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
    },
    {
      key: 'phone',
      label: 'Phone',
      sortable: true,
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (value) => (
        <Badge
          variant={String(value) === 'admin' ? 'error' : String(value) === 'manager' ? 'warning' : 'info'}
          className="capitalize"
        >
          {String(value)}
        </Badge>
      ),
    },
    {
      key: 'joinedDate',
      label: 'Joined Date',
      sortable: true,
      render: (value) => formatDate(String(value)),
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (value) => (
        <Badge variant={Boolean(value) ? 'success' : 'error'}>
          {Boolean(value) ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, user) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="tertiary"
            onClick={() => user && handleEditUser(user)}
            leftIcon={<Edit className="h-3 w-3" />}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="tertiary"
            onClick={() => user && handleDeleteUser(user)}
            leftIcon={<Trash2 className="h-3 w-3" />}
            className="text-secondary-red border-secondary-red hover:bg-red-50"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-secondary-red">Failed to load users</p>
          <Button
            variant="tertiary"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['users'] })}
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-black">Users & Contacts</h1>
          <p className="text-neutral-gray">Manage your team members and contacts</p>
        </div>
        <Button
          onClick={handleAddUser}
          leftIcon={<UserPlus className="h-4 w-4" />}
        >
          Add New User
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search users..."
                leftIcon={<Search className="h-4 w-4" />}
                onChange={handleSearch}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <Table
            data={filteredAndSortedUsers}
            columns={columns}
            onSort={handleSort}
            sortKey={sortKey}
            sortDirection={sortDirection}
            isLoading={isLoading}
            emptyMessage="No users found"
          />
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* User Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        user={selectedUser}
        isLoading={createUserMutation.isPending || updateUserMutation.isPending}
      />
    </div>
  );
};

export default UsersPage;