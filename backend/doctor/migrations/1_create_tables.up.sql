CREATE TABLE doctors (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  experience_years INTEGER NOT NULL,
  location TEXT NOT NULL,
  clinic_name TEXT NOT NULL,
  consultation_fee INTEGER NOT NULL,
  rating DOUBLE PRECISION NOT NULL DEFAULT 0,
  patient_stories INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  available_today BOOLEAN NOT NULL DEFAULT false,
  no_booking_fee BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_doctors_specialization ON doctors(specialization);
CREATE INDEX idx_doctors_location ON doctors(location);
CREATE INDEX idx_doctors_rating ON doctors(rating DESC);

-- Insert sample data
INSERT INTO doctors (name, specialization, experience_years, location, clinic_name, consultation_fee, rating, patient_stories, image_url, available_today, no_booking_fee) VALUES
('Dr. Sheelavathi Natraj', 'Dermatologist', 21, 'JP Nagar,Bangalore', 'Sapphire Skin And Aesthetics Clinic', 800, 94, 1506, '/api/placeholder/150/150', true, true),
('Dr. Aesthetic Heart', 'Dermatologist', 13, 'Jayanagar', 'Aesthetic Heart Dermatology & Cardiology Clinic', 800, 97, 159, '/api/placeholder/150/150', false, false),
('Dr. Rajesh Kumar', 'Dermatologist', 15, 'JP Nagar,Bangalore', 'Skin Care Clinic', 600, 92, 234, '/api/placeholder/150/150', true, false),
('Dr. Priya Sharma', 'Dermatologist', 8, 'Koramangala,Bangalore', 'Advanced Dermatology Center', 750, 89, 456, '/api/placeholder/150/150', false, true),
('Dr. Amit Patel', 'Dermatologist', 12, 'Indiranagar,Bangalore', 'Patel Skin Clinic', 550, 91, 678, '/api/placeholder/150/150', true, false),
('Dr. Sunita Reddy', 'Dermatologist', 18, 'Whitefield,Bangalore', 'Reddy Dermatology', 900, 95, 890, '/api/placeholder/150/150', false, false),
('Dr. Vikram Singh', 'Dermatologist', 10, 'HSR Layout,Bangalore', 'Singh Skin Solutions', 650, 88, 345, '/api/placeholder/150/150', true, true),
('Dr. Meera Joshi', 'Dermatologist', 14, 'Malleshwaram,Bangalore', 'Joshi Dermatology Clinic', 700, 93, 567, '/api/placeholder/150/150', false, false);
