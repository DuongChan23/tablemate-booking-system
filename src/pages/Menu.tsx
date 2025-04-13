import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import menuService from '@/services/menuService';
import { MenuItem } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

// Define a local interface that extends the global MenuItem but with price as string for display
interface MenuItemDisplay extends Omit<MenuItem, 'price'> {
  price: string;
}

const Menu = () => {
  const [activeTab, setActiveTab] = useState('starters');
  const [menuItems, setMenuItems] = useState<{
    starters: MenuItemDisplay[];
    mains: MenuItemDisplay[];
    desserts: MenuItemDisplay[];
    drinks: MenuItemDisplay[];
  }>({
    starters: [],
    mains: [],
    desserts: [],
    drinks: []
  });
  const [loading, setLoading] = useState(true);

  // Fetch menu items from service
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const allItems = await menuService.getAll();
        
        // Map the items from the global type to our local display type, converting price to string
        const mappedItems: MenuItemDisplay[] = allItems.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: `$${item.price.toFixed(2)}`,
          image: item.image || '',
          category: item.category,
          isActive: item.isActive
        }));
        
        // Categorize the items
        const categorizedItems = {
          starters: mappedItems.filter(item => item.category.toLowerCase() === 'starter' || item.category.toLowerCase() === 'appetizer'),
          mains: mappedItems.filter(item => item.category.toLowerCase() === 'main' || item.category.toLowerCase() === 'main course'),
          desserts: mappedItems.filter(item => item.category.toLowerCase() === 'dessert'),
          drinks: mappedItems.filter(item => item.category.toLowerCase() === 'drink' || item.category.toLowerCase() === 'beverage')
        };
        
        setMenuItems(categorizedItems);
      } catch (error) {
        console.error("Failed to load menu items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const renderMenuItems = (items: MenuItemDisplay[]) => {
    if (loading) {
      return (
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {[1, 2, 3, 4].map((item) => (
            <Card key={item} className="overflow-hidden flex flex-col md:flex-row">
              <div className="md:w-1/3 h-48 md:h-auto">
                <Skeleton className="w-full h-full" />
              </div>
              <div className="p-6 md:w-2/3">
                <div className="flex justify-between items-start mb-2">
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </Card>
          ))}
        </div>
      );
    }

    if (items.length === 0) {
      return <div className="flex justify-center py-12">No items available in this category.</div>;
    }

    return (
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-1/3 h-48 md:h-auto">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 md:w-2/3">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-serif font-bold">{item.name}</h3>
                <span className="text-tablemate-burgundy font-medium">{item.price}</span>
              </div>
              <p className="text-gray-600">{item.description}</p>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-tablemate-burgundy py-16 text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Our Menu</h1>
          <p className="max-w-2xl mx-auto">
            Experience our carefully curated dishes, prepared with the finest ingredients and served with passion.
          </p>
        </div>
      </div>
      
      <main className="flex-grow py-12 bg-tablemate-cream">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="starters" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-white">
                <TabsTrigger value="starters">Starters</TabsTrigger>
                <TabsTrigger value="mains">Main Courses</TabsTrigger>
                <TabsTrigger value="desserts">Desserts</TabsTrigger>
                <TabsTrigger value="drinks">Drinks</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="starters">
              {renderMenuItems(menuItems.starters)}
            </TabsContent>
            
            <TabsContent value="mains">
              {renderMenuItems(menuItems.mains)}
            </TabsContent>
            
            <TabsContent value="desserts">
              {renderMenuItems(menuItems.desserts)}
            </TabsContent>
            
            <TabsContent value="drinks">
              {renderMenuItems(menuItems.drinks)}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Menu;
