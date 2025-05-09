'use client';

import { Copyright } from 'lucide-react';
import Link from 'next/link';

const footerLinks = {
  Tools: ['LinkedIn Post Generator', 'Hashtag Recommender', 'Engagement Booster'],
  Resources: ['50 LinkedIn Hooks', 'Viral Post Templates', 'Growth Tips'],
  Navigation: ['Pricing', 'Login', 'Sign Up'],
  Legal: ['Terms of Service', 'Privacy Policy'],
};

export default function FooterSection() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 px-6 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-sm">
        {Object.entries(footerLinks).map(([section, links]) => (
          <div key={section}>
            <h4 className="text-white font-semibold mb-4">{section}</h4>
            <ul className="space-y-2">
              {links.map((link, idx) => (
                <li key={idx}>
                  <Link href="#" className="hover:text-white transition">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-700 mt-12 pt-6 text-center flex flex-col items-center gap-2">
        <div className="flex items-center gap-1 text-gray-500">
          <Copyright className="h-4 w-4" />
          <span>{new Date().getFullYear()} EasyGen. All rights reserved.</span>
        </div>
        <p className="text-xs text-gray-500">Built with 💡 and AI to help you grow faster on LinkedIn.</p>
      </div>
    </footer>
  );
}
