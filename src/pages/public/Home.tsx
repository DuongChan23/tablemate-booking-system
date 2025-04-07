
import React from 'react';
import Navbar from '@/components/Navbar';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif font-bold mb-6">Welcome to TableMate</h1>
        <p className="mb-4">
          Your premier restaurant management system. Book tables, browse our menu, and enjoy a 
          seamless dining experience.
        </p>
      </main>
    </div>
  );
};

export default Home;
