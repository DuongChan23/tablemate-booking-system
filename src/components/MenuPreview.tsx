
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const menuItems = [
  {
    id: 1,
    name: 'Beef Wellington',
    category: 'Main Course',
    description: 'Tender fillet of beef, wrapped in layers of mushroom duxelles, ham, and flaky puff pastry.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400&auto=format&fit=crop',
    price: '$42.00'
  },
  {
    id: 2,
    name: 'Lobster Bisque',
    category: 'Appetizer',
    description: 'Smooth, creamy soup made from lobster stock, aromatic vegetables, and a touch of brandy.',
    image: 'https://images.unsplash.com/photo-1606255557509-6ba258c2b5e2?q=80&w=400&auto=format&fit=crop',
    price: '$18.00'
  },
  {
    id: 3,
    name: 'Chocolate Soufflé',
    category: 'Dessert',
    description: 'Light and airy chocolate dessert served with a rich vanilla crème anglaise.',
    image: 'https://images.unsplash.com/photo-1579306194872-64d3b7bac4c2?q=80&w=400&auto=format&fit=crop',
    price: '$14.00'
  }
];

const MenuPreview = () => {
  return (
    <section className="py-20 bg-tablemate-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Our Signature Menu</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Preview some of our most celebrated dishes, expertly crafted by our award-winning chefs.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {menuItems.map(item => (
            <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-md transition-all hover:shadow-xl">
              <div className="h-48 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-serif font-bold">{item.name}</h3>
                  <span className="text-tablemate-burgundy font-medium">{item.price}</span>
                </div>
                <span className="inline-block text-sm text-tablemate-burgundy mb-2">{item.category}</span>
                <p className="text-gray-600 mb-4">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/menu">
            <Button variant="outline" className="border-tablemate-burgundy text-tablemate-burgundy hover:bg-tablemate-burgundy hover:text-white">
              View Full Menu
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MenuPreview;
