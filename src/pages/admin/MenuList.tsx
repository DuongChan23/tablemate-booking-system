
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MenuItem } from '@/types';
import { Search, Plus, Edit, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import menuService from '@/services/menuService';

const MenuList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [menuItemToDelete, setMenuItemToDelete] = useState<MenuItem | null>(null);
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'main',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    isActive: true
  });
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);

  React.useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const data = await menuService.getAll();
        setMenuItems(data);
      } catch (error) {
        console.error('Failed to fetch menu items:', error);
        toast({
          title: "Error",
          description: "Failed to load menu items",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMenuItems();
  }, []);

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

  const handleAddMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await menuService.create(newMenuItem);
      setMenuItems([...menuItems, response]);
      toast({
        title: "Success",
        description: "Menu item added successfully",
      });
      setIsAddDialogOpen(false);
      setNewMenuItem({
        name: '',
        description: '',
        price: 0,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
        isActive: true
      });
    } catch (error) {
      console.error('Failed to add menu item:', error);
      toast({
        title: "Error",
        description: "Failed to add menu item",
        variant: "destructive",
      });
    }
  };

  const handleEditMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMenuItem) return;
    
    try {
      const response = await menuService.update(editingMenuItem.id, editingMenuItem);
      setMenuItems(menuItems.map(item => item.id === response.id ? response : item));
      toast({
        title: "Success",
        description: "Menu item updated successfully",
      });
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Failed to update menu item:', error);
      toast({
        title: "Error",
        description: "Failed to update menu item",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMenuItem = async () => {
    if (!menuItemToDelete) return;
    
    try {
      await menuService.delete(menuItemToDelete.id);
      setMenuItems(menuItems.filter(item => item.id !== menuItemToDelete.id));
      toast({
        title: "Success",
        description: "Menu item deleted successfully",
      });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Failed to delete menu item:', error);
      toast({
        title: "Error",
        description: "Failed to delete menu item",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-serif font-bold">Menu Items</h1>
          <Button 
            className="bg-tablemate-burgundy hover:bg-tablemate-burgundy/90"
            onClick={() => setIsAddDialogOpen(true)}
          >
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
            {isLoading ? (
              <div className="flex justify-center p-6">
                <p>Loading menu items...</p>
              </div>
            ) : (
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
                  {filteredMenuItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No menu items found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMenuItems.map((item) => (
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
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {
                                setEditingMenuItem(item);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {
                                setMenuItemToDelete(item);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Menu Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Menu Item</DialogTitle>
            <DialogDescription>
              Fill in the details below to add a new menu item.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddMenuItem}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newMenuItem.name}
                  onChange={(e) => setNewMenuItem({...newMenuItem, name: e.target.value})}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newMenuItem.description}
                  onChange={(e) => setNewMenuItem({...newMenuItem, description: e.target.value})}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newMenuItem.price}
                  onChange={(e) => setNewMenuItem({...newMenuItem, price: parseFloat(e.target.value)})}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newMenuItem.category}
                  onChange={(e) => setNewMenuItem({...newMenuItem, category: e.target.value})}
                  required
                >
                  <option value="starter">Starter</option>
                  <option value="main">Main Course</option>
                  <option value="dessert">Dessert</option>
                  <option value="beverage">Beverage</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={newMenuItem.image}
                  onChange={(e) => setNewMenuItem({...newMenuItem, image: e.target.value})}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="isActive"
                  type="checkbox"
                  className="h-4 w-4"
                  checked={newMenuItem.isActive}
                  onChange={(e) => setNewMenuItem({...newMenuItem, isActive: e.target.checked})}
                />
                <Label htmlFor="isActive">Available</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-tablemate-burgundy hover:bg-tablemate-burgundy/90">Add Menu Item</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Menu Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
            <DialogDescription>
              Update the menu item details below.
            </DialogDescription>
          </DialogHeader>
          {editingMenuItem && (
            <form onSubmit={handleEditMenuItem}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={editingMenuItem.name}
                    onChange={(e) => setEditingMenuItem({...editingMenuItem, name: e.target.value})}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Input
                    id="edit-description"
                    value={editingMenuItem.description}
                    onChange={(e) => setEditingMenuItem({...editingMenuItem, description: e.target.value})}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-price">Price ($)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={editingMenuItem.price}
                    onChange={(e) => setEditingMenuItem({...editingMenuItem, price: parseFloat(e.target.value)})}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <select
                    id="edit-category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={editingMenuItem.category}
                    onChange={(e) => setEditingMenuItem({...editingMenuItem, category: e.target.value})}
                  >
                    <option value="starter">Starter</option>
                    <option value="main">Main Course</option>
                    <option value="dessert">Dessert</option>
                    <option value="beverage">Beverage</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-image">Image URL</Label>
                  <Input
                    id="edit-image"
                    value={editingMenuItem.image}
                    onChange={(e) => setEditingMenuItem({...editingMenuItem, image: e.target.value})}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="edit-isActive"
                    type="checkbox"
                    className="h-4 w-4"
                    checked={editingMenuItem.isActive}
                    onChange={(e) => setEditingMenuItem({...editingMenuItem, isActive: e.target.checked})}
                  />
                  <Label htmlFor="edit-isActive">Available</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-tablemate-burgundy hover:bg-tablemate-burgundy/90">Update Menu Item</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Menu Item Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this menu item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteMenuItem}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default MenuList;
