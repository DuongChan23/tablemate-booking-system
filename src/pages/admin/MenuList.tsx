import React, { useState, useRef } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MenuItem } from '@/types';
import { Search, Plus, Edit, Trash, Upload, ImageIcon } from 'lucide-react';
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [editImagePreview, setEditImagePreview] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setIsLoading(true);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEdit) {
          setEditImageFile(file);
          setEditImagePreview(reader.result as string);
          if (editingMenuItem) {
            setEditingMenuItem({...editingMenuItem, image: reader.result as string});
          }
        } else {
          setImageFile(file);
          setImagePreview(reader.result as string);
          setNewMenuItem({...newMenuItem, image: reader.result as string});
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await menuService.create(newMenuItem, imageFile || undefined);
      // Add the new item to the menuItems state without causing duplicate items
      setMenuItems(prevItems => {
        // Check if the item already exists in the array to prevent duplicates
        const itemExists = prevItems.some(item => item.id === response.id);
        if (itemExists) {
          return prevItems;
        }
        return [...prevItems, response];
      });
      
      toast({
        title: "Success",
        description: "Menu item added successfully",
      });
      setIsAddDialogOpen(false);
      setImageFile(null);
      setImagePreview('');
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
      const response = await menuService.update(editingMenuItem.id, editingMenuItem, editImageFile || undefined);
      setMenuItems(menuItems.map(item => item.id === response.id ? response : item));
      toast({
        title: "Success",
        description: "Menu item updated successfully",
      });
      setIsEditDialogOpen(false);
      setEditImageFile(null);
      setEditImagePreview('');
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
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Price</TableHead>
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
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate">
                            {item.description}
                          </div>
                        </TableCell>
                        <TableCell>${item.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {
                                setEditingMenuItem(item);
                                setEditImagePreview(item.image || '');
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
                <Label htmlFor="image">Image</Label>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={(e) => handleImageChange(e)}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
                    </Button>
                  </div>
                  
                  {imagePreview ? (
                    <div className="relative aspect-square w-full max-h-[200px] overflow-hidden rounded-md border">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="h-full w-full object-cover" 
                      />
                    </div>
                  ) : (
                    <div className="flex justify-center items-center aspect-square w-full max-h-[200px] rounded-md border bg-muted">
                      <ImageIcon className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                </div>
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
                  <Label htmlFor="edit-image">Image</Label>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={editFileInputRef}
                        onChange={(e) => handleImageChange(e, true)}
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => editFileInputRef.current?.click()}
                        className="w-full"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload New Image
                      </Button>
                    </div>
                    
                    {editImagePreview ? (
                      <div className="relative aspect-square w-full max-h-[200px] overflow-hidden rounded-md border">
                        <img 
                          src={editImagePreview} 
                          alt="Preview" 
                          className="h-full w-full object-cover" 
                        />
                      </div>
                    ) : (
                      <div className="flex justify-center items-center aspect-square w-full max-h-[200px] rounded-md border bg-muted">
                        <ImageIcon className="h-10 w-10 text-muted-foreground" />
                      </div>
                    )}
                  </div>
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
