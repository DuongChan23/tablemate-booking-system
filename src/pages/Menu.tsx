
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

// Mock data for menu items
const menuData = {
  starters: [
    {
      id: 1,
      name: 'Lobster Bisque',
      description: 'Smooth, creamy soup made from lobster stock, aromatic vegetables, and a touch of brandy.',
      price: '$18.00',
      image: 'https://images.unsplash.com/photo-1606255557509-6ba258c2b5e2?q=80&w=400&auto=format&fit=crop'
    },
    {
      id: 2,
      name: 'Tuna Tartare',
      description: 'Fresh diced tuna mixed with avocado, citrus, and spices, served with crisp wonton chips.',
      price: '$16.00',
      image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=400&auto=format&fit=crop'
    },
    {
      id: 3,
      name: 'Burrata Salad',
      description: 'Creamy burrata cheese, heirloom tomatoes, basil, and aged balsamic reduction.',
      price: '$14.00',
      image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=400&auto=format&fit=crop'
    }
  ],
  mains: [
    {
      id: 4,
      name: 'Beef Wellington',
      description: 'Tender fillet of beef, wrapped in layers of mushroom duxelles, ham, and flaky puff pastry.',
      price: '$42.00',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400&auto=format&fit=crop'
    },
    {
      id: 5,
      name: 'Pan-Seared Salmon',
      description: 'Wild-caught salmon with crispy skin, served with seasonal vegetables and lemon herb sauce.',
      price: '$34.00',
      image: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?q=80&w=400&auto=format&fit=crop'
    },
    {
      id: 6,
      name: 'Mushroom Risotto',
      description: 'Creamy Arborio rice slowly cooked with mixed forest mushrooms, white wine, and Parmesan.',
      price: '$28.00',
      image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?q=80&w=400&auto=format&fit=crop'
    }
  ],
  desserts: [
    {
      id: 7,
      name: 'Chocolate Soufflé',
      description: 'Light and airy chocolate dessert served with a rich vanilla crème anglaise.',
      price: '$14.00',
      image: 'https://images.unsplash.com/photo-1579306194872-64d3b7bac4c2?q=80&w=400&auto=format&fit=crop'
    },
    {
      id: 8,
      name: 'Crème Brûlée',
      description: 'Classic vanilla custard with a caramelized sugar crust, garnished with fresh berries.',
      price: '$12.00',
      image: 'https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?q=80&w=400&auto=format&fit=crop'
    },
    {
      id: 9,
      name: 'Tiramisu',
      description: 'Traditional Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream.',
      price: '$10.00',
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=400&auto=format&fit=crop'
    }
  ],
  drinks: [
    {
      id: 10,
      name: 'Signature Martini',
      description: 'House gin, dry vermouth, and olive brine, garnished with blue cheese stuffed olives.',
      price: '$14.00',
      image: 'https://images.unsplash.com/photo-1575023782549-62ca0d244b39?q=80&w=400&auto=format&fit=crop'
    },
    {
      id: 11,
      name: 'Aged Negroni',
      description: 'Barrel-aged gin, Campari, and sweet vermouth with an orange twist.',
      price: '$16.00',
      image: 'https://images.unsplash.com/photo-1527761939622-933c729bde0a?q=80&w=400&auto=format&fit=crop'
    },
    {
      id: 12,
      name: 'Bordeaux Selection',
      description: 'Rotating premium selection from our cellar, ask your server for today\'s pour.',
      price: '$22.00/glass',
      image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?q=80&w=400&auto=format&fit=crop'
    }
  ]
};

const Menu = () => {
  const [activeTab, setActiveTab] = useState('starters');

  const renderMenuItems = (items: any[]) => {
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
              {renderMenuItems(menuData.starters)}
            </TabsContent>
            
            <TabsContent value="mains">
              {renderMenuItems(menuData.mains)}
            </TabsContent>
            
            <TabsContent value="desserts">
              {renderMenuItems(menuData.desserts)}
            </TabsContent>
            
            <TabsContent value="drinks">
              {renderMenuItems(menuData.drinks)}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Menu;
