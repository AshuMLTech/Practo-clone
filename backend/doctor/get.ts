import { api, APIError } from "encore.dev/api";
import { doctorDB } from "./db";
import type { Doctor } from "./search";

export interface GetDoctorParams {
  id: number;
}

// Retrieves a specific doctor by ID.
export const get = api<GetDoctorParams, Doctor>(
  { expose: true, method: "GET", path: "/doctors/:id" },
  async (params) => {
    const doctor = await doctorDB.queryRow<{
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
    }>`
      SELECT 
        id, name, specialization, experience_years, location, clinic_name,
        consultation_fee, rating, patient_stories, image_url, available_today, no_booking_fee
      FROM doctors 
      WHERE id = ${params.id}
    `;

    if (!doctor) {
      throw APIError.notFound("doctor not found");
    }

    return {
      id: doctor.id,
      name: doctor.name,
      specialization: doctor.specialization,
      experienceYears: doctor.experience_years,
      location: doctor.location,
      clinicName: doctor.clinic_name,
      consultationFee: doctor.consultation_fee,
      rating: doctor.rating,
      patientStories: doctor.patient_stories,
      imageUrl: doctor.image_url,
      availableToday: doctor.available_today,
      noBookingFee: doctor.no_booking_fee,
    };
  }
);
