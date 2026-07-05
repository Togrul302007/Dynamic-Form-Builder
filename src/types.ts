export interface Applicant {
  fullName: string;
  email: string;
}

export interface University {
  id: string; // Stable unique ID for animation keying
  name: string;
  major: string;
  graduationYear: string;
}

export interface FormValues {
  applicant: Applicant;
  universities: University[];
}
