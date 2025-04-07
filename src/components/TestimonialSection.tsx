
import React from 'react';

const testimonials = [
  {
    id: 1,
    text: "TableMate made booking our anniversary dinner so easy. The staff even knew it was our special day!",
    author: "Emma & James Thompson",
    location: "New York"
  },
  {
    id: 2,
    text: "As a restaurant manager, TableMate has transformed how we handle reservations. Highly recommended!",
    author: "Michael Chen",
    location: "San Francisco"
  },
  {
    id: 3,
    text: "I use TableMate for all my business dinners. The platform is elegant and efficient - just like the restaurants it features.",
    author: "Sarah Williams",
    location: "Chicago"
  }
];

const TestimonialSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">What Our Clients Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover why diners and restaurant owners love using TableMate.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="bg-tablemate-cream p-6 rounded-lg shadow-md">
              <svg className="w-10 h-10 text-tablemate-burgundy mb-4 opacity-50" fill="currentColor" viewBox="0 0 32 32">
                <path d="M10 8c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10zM10 26c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"></path>
                <path d="M16 6c0-3.3-2.7-6-6-6s-6 2.7-6 6c0 2.6 1.7 4.8 4 5.7v-2.1c-1.2-0.7-2-2-2-3.6 0-2.2 1.8-4 4-4s4 1.8 4 4c0 1.6-0.8 2.9-2 3.6v2.1c2.3-0.9 4-3.1 4-5.7z"></path>
              </svg>
              <p className="mb-4 text-gray-700 italic">{testimonial.text}</p>
              <div>
                <p className="font-bold text-tablemate-charcoal">{testimonial.author}</p>
                <p className="text-sm text-gray-500">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
