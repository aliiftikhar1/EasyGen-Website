'use client';
import React from'react';
import { Button } from './ui/button';

const HeroSection = ({ title, subtitle, ctaText, onCtaClick }) => {
  return (
    <section className="py-16 px-4 md:px-8 text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">{title}</h1>
        <p className="text-gray-600 mb-8">{subtitle}</p>
        <Button 
          variant="primary" 
          onClick={onCtaClick}
          className="flex items-center mx-auto"
        >
          {ctaText}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;