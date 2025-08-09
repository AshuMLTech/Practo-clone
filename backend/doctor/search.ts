import { api, Query } from "encore.dev/api";
import { doctorDB } from "./db";

export interface SearchDoctorsParams {
  location?: Query<string>;
  specialization?: Query<string>;
  limit?: Query<number>;
  offset?: Query<number>;
}

export interface Doctor {
  id: number;
  name: string;
  specialization: string;
  experienceYears: number;
  location: string;
  clinicName: string;
  consultationFee: number;
  rating: number;
  patientStories: number;
  imageUrl?: string;
  availableToday: boolean;
  noBookingFee: boolean;
}

export interface SearchDoctorsResponse {
  doctors: Doctor[];
  total: number;
}

// Searches for doctors based on location and specialization.
export const search = api<SearchDoctorsParams, SearchDoctorsResponse>(
  { expose: true, method: "GET", path: "/doctors/search" },
  async (params) => {
    const limit = params.limit || 10;
    const offset = params.offset || 0;
    
    let whereClause = "WHERE 1=1";
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (params.location) {
      whereClause += ` AND LOWER(location) LIKE LOWER($${paramIndex})`;
      queryParams.push(`%${params.location}%`);
      paramIndex++;
    }

    if (params.specialization) {
      whereClause += ` AND LOWER(specialization) LIKE LOWER($${paramIndex})`;
      queryParams.push(`%${params.specialization}%`);
      paramIndex++;
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM doctors ${whereClause}`;
    const countResult = await doctorDB.rawQueryRow<{ total: number }>(countQuery, ...queryParams);
    const total = countResult?.total || 0;

    // Get doctors with pagination
    const doctorsQuery = `
      SELECT 
        id, name, specialization, experience_years, location, clinic_name,
        consultation_fee, rating, patient_stories, image_url, available_today, no_booking_fee
      FROM doctors 
      ${whereClause}
      ORDER BY rating DESC, patient_stories DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    
    const doctors = await doctorDB.rawQueryAll<{
      id: number;
      name: string;
      specialization: string;
      experience_years: number;
      location: string;
      clinic_name: string;
      consultation_fee: number;
      rating: number;
      patient_stories: number;
      image_url?: string;
      available_today: boolean;
      no_booking_fee: boolean;
    }>(doctorsQuery, ...queryParams, limit, offset);

    return {
      doctors: doctors.map(doc => ({
        id: doc.id,
        name: doc.name,
        specialization: doc.specialization,
        experienceYears: doc.experience_years,
        location: doc.location,
        clinicName: doc.clinic_name,
        consultationFee: doc.consultation_fee,
        rating: doc.rating,
        patientStories: doc.patient_stories,
        imageUrl: doc.image_url,
        availableToday: doc.available_today,
        noBookingFee: doc.no_booking_fee,
      })),
      total,
    };
  }
);
