import { Star, Clock, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Doctor } from '~backend/doctor/search';

interface DoctorCardProps {
  doctor: Doctor;
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Doctor Image and Basic Info */}
        <div className="flex gap-4">
          <div className="relative">
            <img
              src={doctor.imageUrl || '/api/placeholder/100/100'}
              alt={doctor.name}
              className="w-24 h-24 rounded-lg object-cover"
            />
            {doctor.name === 'Dr. Sheelavathi Natraj' && (
              <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                <div className="text-center">
                  <div className="font-bold">practo</div>
                  <div className="text-xs">Skin & Hair</div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-blue-600 mb-1">{doctor.name}</h3>
            <p className="text-gray-600 mb-1">{doctor.specialization}</p>
            <p className="text-sm text-gray-500 mb-2">
              {doctor.experienceYears} years experience overall
            </p>
            <p className="text-sm text-gray-700 mb-2">{doctor.location}</p>
            <p className="text-sm text-gray-600 mb-3">
              {doctor.clinicName}
              {doctor.name === 'Dr. Sheelavathi Natraj' && ' + 1 more'}
            </p>
            <p className="text-sm font-medium text-gray-900">
              ₹{doctor.consultationFee} Consultation fee{doctor.name === 'Dr. Sheelavathi Natraj' ? ' at clinic' : ''}
            </p>
          </div>
        </div>

        {/* Rating and Actions */}
        <div className="flex flex-col justify-between lg:items-end lg:text-right min-w-[200px]">
          <div className="mb-4">
            {doctor.availableToday && (
              <div className="flex items-center text-green-600 text-sm mb-2">
                <Clock className="w-4 h-4 mr-1" />
                Available Today
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-green-600 text-white px-2 py-1 rounded text-sm">
                <Star className="w-3 h-3 mr-1 fill-current" />
                {doctor.rating}%
              </div>
              <span className="text-sm text-gray-600 underline cursor-pointer">
                {doctor.patientStories} Patient Stories
              </span>
            </div>
            
            <div className="space-y-2">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Book Clinic Visit
                {doctor.noBookingFee && (
                  <div className="text-xs">No Booking Fee</div>
                )}
              </Button>
              
              {doctor.name === 'Dr. Sheelavathi Natraj' && (
                <Button variant="outline" className="w-full text-blue-600 border-blue-600">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Clinic
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
