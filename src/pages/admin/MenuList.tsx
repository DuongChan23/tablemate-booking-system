
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MenuItem } from '@/types';
import { Search, Plus, Edit, Trash } from 'lucide-react';

// Mock data for menu items
const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Lobster Bisque',
    description: 'Smooth, creamy soup made from lobster stock, aromatic vegetables, and a touch of brandy.',
    price: 18,
    image: 'https://images.unsplash.com/photo-1606255557509-6ba258c2b5e2',
    category: 'starter',
    isActive: true
  },
  {
    id: '2',
    name: 'Beef Wellington',
    description: 'Tender fillet of beef, wrapped in layers of mushroom duxelles, ham, and flaky puff pastry.',
    price: 42,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947',
    category: 'main',
    isActive: true
  },
  {
    id: '3',
    name: 'Chocolate Soufflé',
    description: 'Light and airy chocolate dessert served with a rich vanilla crème anglaise.',
    price: 14,
    image: 'https://images.unsplash.com/photo-1579306194872-64d3b7bac4c2',
    category: 'dessert',
    isActive: true
  },
  {
    id: '4',
    name: 'Signature Martini',
    description: 'House gin, dry vermouth, and olive brine, garnished with blue cheese stuffed olives.',
    price: 14,
    image: 'https://images.unsplash.com/photo-1575023782549-62ca0d244b39',
    category: 'main',
    isActive: false
  },
  {
    id: '5',
    name: 'Truffle Risotto',
    description: 'Creamy Arborio rice with wild mushrooms, finished with truffle oil and Parmesan.',
    price: 28,
    image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a',
    category: 'main',
    isActive: true
  }
];

const MenuList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [menuItems] = useState<MenuItem[]>(mockMenuItems);

  const filteredMenuItems = menuItems.filter((item) => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryLabel = (category: string) => {
    switch(category) {
      case 'popular': return 'Popular';
      case 'starter': return 'Starter';
      case 'main': return 'Main Course';
      case 'dessert': return 'Dessert';
      default: return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-serif font-bold">Menu Items</h1>
          <Button className="bg-tablemate-burgundy hover:bg-tablemate-burgundy/90">
            <Plus size={16} className="mr-2" />
            Add Menu Item
          </Button>
        </div>
        
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search menu items..." 
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
            <CardTitle>Menu Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMenuItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-xs">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getCategoryLabel(item.category)}</TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.isActive ? 'Available' : 'Unavailable'}
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

export default MenuList;
