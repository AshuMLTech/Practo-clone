import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Find Doctors', href: '/doctors', active: true },
    { name: 'Video Consult', href: '#' },
    { name: 'Surgeries', href: '#' }
  ];

  const dropdownItems = [
    { name: 'For Corporates', isNew: true },
    { name: 'For Providers' },
    { name: 'Security & help' }
  ];

  return (
    <header className="bg-white shadow-sm relative z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm"></span>
              </div>
              <span className="text-xl font-bold text-gray-900">practo</span>
              <div className="w-2 h-2 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm"></span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors ${
                  item.active 
                    ? 'text-blue-600 border-b-2 border-blue-600 pb-4' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {dropdownItems.map((item) => (
              <div key={item.name} className="relative">
                <Button variant="ghost" className="flex items-center space-x-1">
                  {item.isNew && (
                    <span className="bg-blue-600 text-white text-xs px-1 rounded mr-1">NEW</span>
                  )}
                  <span className="text-sm">{item.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm">
              Login / Signup
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-t shadow-lg">
            <div className="px-4 py-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block text-sm font-medium text-gray-700 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="border-t pt-4 space-y-2">
                {dropdownItems.map((item) => (
                  <div key={item.name} className="flex items-center">
                    {item.isNew && (
                      <span className="bg-blue-600 text-white text-xs px-1 rounded mr-2">NEW</span>
                    )}
                    <span className="text-sm text-gray-700">{item.name}</span>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full mt-4">
                  Login / Signup
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
