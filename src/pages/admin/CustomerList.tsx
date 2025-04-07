
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Customer } from '@/types';
import { Search, Plus, Edit, Trash } from 'lucide-react';

// Mock data for customers
const mockCustomers: Customer[] = [
  {
    id: '1',
    userId: 'user1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '555-123-4567',
    address: '123 Main St, City',
    visits: 8,
    status: 'active'
  },
  {
    id: '2',
    userId: 'user2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '555-987-6543',
    address: '456 Oak Dr, Town',
    visits: 12,
    status: 'active'
  },
  {
    id: '3',
    userId: 'user3',
    firstName: 'Robert',
    lastName: 'Johnson',
    email: 'robert.johnson@example.com',
    phone: '555-555-5555',
    address: '789 Pine Ave, Village',
    visits: 3,
    status: 'inactive'
  },
  {
    id: '4',
    userId: 'user4',
    firstName: 'Emily',
    lastName: 'Williams',
    email: 'emily.williams@example.com',
    phone: '555-222-3333',
    address: '101 Cedar Ln, County',
    visits: 15,
    status: 'active'
  },
  {
    id: '5',
    userId: 'user5',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@example.com',
    phone: '555-777-8888',
    address: '202 Maple St, District',
    visits: 1,
    status: 'active'
  }
];

const CustomerList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers] = useState<Customer[]>(mockCustomers);

  const filteredCustomers = customers.filter((customer) => 
    customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-serif font-bold">Customers</h1>
          <Button className="bg-tablemate-burgundy hover:bg-tablemate-burgundy/90">
            <Plus size={16} className="mr-2" />
            Add Customer
          </Button>
        </div>
        
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search customers..." 
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline">Filters</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Customer List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Visits</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">
                      {customer.firstName} {customer.lastName}
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.visits}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        customer.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default CustomerList;
