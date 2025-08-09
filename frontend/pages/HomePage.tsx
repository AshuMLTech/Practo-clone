import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, MessageSquare, ShoppingCart, FileText, TestTube, BookOpen, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '../components/Header';

export default function HomePage() {
  const [location, setLocation] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (searchTerm) params.set('specialization', searchTerm);
    navigate(`/doctors?${params.toString()}`);
  };

  const popularSearches = [
    'Dermatologist',
    'Pediatrician', 
    'Gynecologist/Obstetrician',
    'Orthopedist'
  ];

  const services = [
    { icon: MessageSquare, title: 'Consult with a doctor ', description: '' },
    { icon: ShoppingCart, title: 'Order Medicines', description: '' },
    { icon: FileText, title: 'View medical records', description: '' },
    { icon: TestTube, title: 'Book test', description: 'New', isNew: true },
    { icon: BookOpen, title: 'Read articles', description: '' },
    { icon: Users, title: 'For healthcare providers', description: '' }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-400 rounded-full"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-orange-400 rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-green-400 rounded-full"></div>
          <div className="absolute bottom-40 right-1/3 w-20 h-20 bg-purple-400 rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">
              Your home for health
            </h1>
            
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl text-white mb-8">Find and Book</h2>
              
              {/* Search Form */}
              <div className="bg-white rounded-none p-2 flex flex-col md:flex-row gap-2 shadow-lg">
                <div className="flex items-center flex-1 px-4 py-2 border-r border-gray-200">
                  <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                  <Input
                    placeholder="Bangalore"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="border-0 focus:ring-0 text-gray-700"
                  />
                </div>
                <div className="flex items-center flex-1 px-4 py-2">
                  <Search className="w-5 h-5 text-gray-400 mr-2" />
                  <Input
                    placeholder="Search doctors, clinics, hospitals, etc."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-0 focus:ring-0 text-gray-700"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>
              
              {/* Popular Searches */}
              <div className="mt-6 text-left">
                <span className="text-white/80 text-sm">Popular searches: </span>
                <div className="inline-flex flex-wrap gap-2 mt-2">
                  {popularSearches.map((search, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      onClick={() => {
                        setSearchTerm(search);
                        const params = new URLSearchParams();
                        if (location) params.set('location', location);
                        params.set('specialization', search);
                        navigate(`/doctors?${params.toString()}`);
                      }}
                    >
                      {search}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-blue-900 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {services.map((service, index) => (
              <div key={index} className="text-center text-white hover:bg-white/10 rounded-lg p-4 transition-colors cursor-pointer">
                <div className="relative inline-block mb-2">
                  <service.icon className="w-8 h-8 mx-auto" />
                  {service.isNew && (
                    <span className="absolute -top-1 -right-1 bg-green-500 text-xs px-1 rounded text-white">
                      New
                    </span>
                  )}
                </div>
                <p className="text-sm">{service.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
