import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Search, ChevronDown, Star, Clock, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';
import type { Doctor } from '~backend/doctor/search';
import Header from '../components/Header';
import DoctorCard from '../components/DoctorCard';
import FilterSection from '../components/FilterSection';

export default function DoctorListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [specialization, setSpecialization] = useState(searchParams.get('specialization') || '');
  const [sortBy, setSortBy] = useState('relevance');
  const { toast } = useToast();

  const { data, isLoading, error } = useQuery({
    queryKey: ['doctors', location, specialization],
    queryFn: async () => {
      try {
        return await backend.doctor.search({
          location: location || undefined,
          specialization: specialization || undefined,
          limit: 20,
          offset: 0
        });
      } catch (err) {
        console.error('Failed to fetch doctors:', err);
        throw err;
      }
    }
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load doctors. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (specialization) params.set('specialization', specialization);
    setSearchParams(params);
  };

  const doctors = data?.doctors || [];
  const total = data?.total || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Search Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center flex-1 border rounded-lg px-4 py-2">
              <MapPin className="w-5 h-5 text-gray-400 mr-2" />
              <Input
                placeholder="Jp Nagar"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border-0 focus:ring-0"
              />
            </div>
            <div className="flex items-center flex-1 border rounded-lg px-4 py-2">
              <Search className="w-5 h-5 text-gray-400 mr-2" />
              <Input
                placeholder="Dermatologist"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="border-0 focus:ring-0"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Filters and Results */}
      <div className="container mx-auto px-4 py-6">
        <FilterSection sortBy={sortBy} setSortBy={setSortBy} />
        
        {/* Results Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            {total} {specialization || 'Doctors'} available in {location || 'your area'}
          </h1>
          <div className="flex items-center text-sm text-gray-600">
            <div className="flex items-center mr-4">
              <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
              Book appointments with minimum wait-time & verified doctor details
            </div>
          </div>
        </div>

        {/* Doctor Cards */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
                <div className="flex space-x-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        )}

        {!isLoading && doctors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No doctors found matching your criteria.</p>
            <p className="text-gray-400 mt-2">Try adjusting your search filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
