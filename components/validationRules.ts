import * as FileSystem from 'expo-file-system';

export type MediaFile = {
  uri: string;
  type: string;
  name: string;
  fileInfo: FileSystem.FileInfo;
};
type ErrorFor<T> = T extends (infer U)[] 
  ? ErrorFor<U>[] | string
  : T extends object
    ? { [K in keyof T]?: ErrorFor<T[K]> }
    : string;

export type ErrorType = {
  [K in keyof FormData]?: ErrorFor<FormData[K]>;
};

  
export type Company = {
  Designation: string;
  CompanyName: string;
  StartDate: Date | null;
  EndDate: Date | null;
};

export type FormData = {
  Email: string;
  Password: string;
  PhoneNumber: string;
  FirstName: string;
  LastName: string;
  DateOfBirth: Date | null;
  Address: string;
  HighestEducation: string;
  HighSchoolName: string;
  HighSchoolGradYear: string;
  DiplomaInstituteName: string;
  DiplomaGradYear: string;
  CollegeName: string;
  CollegeGradYear: string;
  ReferralName: string;
  ReferralNumber: string;
  Companies: Company[];
  Medias: {
    IntroVideo: MediaFile | null;
    ProfilePhoto: MediaFile | null;
  };
  IndustryChoices: string;
  OpenToRelocation: string;
  SalaryRange: string;
  WorkingHours: string;
  JobUpdates: string;
  IndustryUpdates: string;
};

type ValidationRule<T> = {
  test: (value: T, formData: FormData) => boolean;
  message: string;
};

export type ValidationRules = {
  [K in keyof FormData]: ValidationRule<FormData[K]>[];
};

// Helper functions
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhoneNumber = (phone: string) => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
};

const isValidDate = (date: Date | null) => {
  return date instanceof Date && !isNaN(date.getTime());
};

const isAtLeast18YearsOld = (date: Date | null) => {
  if (!date) return false;
  const today = new Date();
  const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  return date <= eighteenYearsAgo;
};

export const signUpValidationRules: ValidationRules = {
  Email: [
    { test: (value) => !!value, message: "Email is required" },
    { test: isValidEmail, message: "Invalid email format" },
  ],
  Password: [
    { test: (value) => !!value, message: "Password is required" },
    { test: (value) => value.length >= 8, message: "Password must be at least 8 characters long" },
  ],
  PhoneNumber: [
    { test: (value) => !!value, message: "Phone number is required" },
    { test: isValidPhoneNumber, message: "Invalid phone number format" },
  ],
  FirstName: [
    { test: (value) => !!value, message: "First name is required" },
    { test: (value) => value.length >= 2, message: "First name must be at least 2 characters long" },
  ],
  LastName: [
    { test: (value) => !!value, message: "Last name is required" },
    { test: (value) => value.length >= 2, message: "Last name must be at least 2 characters long" },
  ],
  DateOfBirth: [
    { test: (value) => !!value, message: "Date of birth is required" },
    { test: isValidDate, message: "Invalid date" },
    { test: isAtLeast18YearsOld, message: "You must be at least 18 years old" },
  ],
  Address: [
    { test: (value) => !!value, message: "Address is required" },
    { test: (value) => value.length >= 5, message: "Address must be at least 5 characters long" },
  ],
  HighestEducation: [
    { test: (value) => !!value, message: "Highest education is required" },
    { test: (value) => ['High School', 'Diploma', 'College'].includes(value), message: "Invalid education level" },
  ],
  HighSchoolName: [
    { test: (value) => !!value, message: "High school name is required" },
  ],
  HighSchoolGradYear: [
    { test: (value) => !!value, message: "High school graduation year is required" },
    { test: (value) => /^\d{4}$/.test(value), message: "Invalid year format" },
    { test: (value) => parseInt(value) <= new Date().getFullYear(), message: "Graduation year cannot be in the future" },
  ],
  DiplomaInstituteName: [
    { test: (value, formData) => formData.HighestEducation !== 'Diploma' || !!value, message: "Diploma institute name is required" },
  ],
  DiplomaGradYear: [
    { test: (value, formData) => formData.HighestEducation !== 'Diploma' || !!value, message: "Diploma graduation year is required" },
    { test: (value) => !value || /^\d{4}$/.test(value), message: "Invalid year format" },
    { test: (value) => !value || parseInt(value) <= new Date().getFullYear(), message: "Graduation year cannot be in the future" },
  ],
  CollegeName: [
    { test: (value, formData) => formData.HighestEducation !== 'College' || !!value, message: "College name is required" },
  ],
  CollegeGradYear: [
    { test: (value, formData) => formData.HighestEducation !== 'College' || !!value, message: "College graduation year is required" },
    { test: (value) => !value || /^\d{4}$/.test(value), message: "Invalid year format" },
    { test: (value) => !value || parseInt(value) <= new Date().getFullYear(), message: "Graduation year cannot be in the future" },
  ],
  Companies: [
    { 
      test: (companies) => companies.every((company) => 
        company.Designation && 
        company.CompanyName && 
        isValidDate(company.StartDate) &&
        (company.EndDate === null || isValidDate(company.EndDate))
      ),
      message: "All company details must be filled"
    },
    {
      test: (companies) => companies.every((company) => 
        !company.EndDate || (company.StartDate && company.EndDate > company.StartDate)
      ),
      message: "End date must be after start date"
    }
  ],
  Medias: [
    { 
      test: (medias) => !!medias.ProfilePhoto, 
      message: "Profile photo is required" 
    },
    { 
      test: (medias) => !!medias.IntroVideo, 
      message: "Intro video is required" 
    },
  ],
  IndustryChoices: [
    { test: (value) => !!value, message: "Industry choice is required" },
  ],
  OpenToRelocation: [
    { test: (value) => !!value, message: "Relocation preference is required" },
  ],
  SalaryRange: [
    { test: (value) => !!value, message: "Salary range is required" },
  ],
  WorkingHours: [
    { test: (value) => !!value, message: "Working hours preference is required" },
  ],
  JobUpdates: [
    { test: (value) => !!value, message: "Job updates preference is required" },
  ],
  IndustryUpdates: [
    { test: (value) => !!value, message: "Industry updates preference is required" },
  ],
  ReferralName: [],
  ReferralNumber: [],
};
export function validateField<K extends keyof FormData>(
    field: K,
    value: FormData[K],
    formData: FormData
  ): ErrorFor<FormData[K]> | null {
    const rules = signUpValidationRules[field];
    if (rules) {
      for (const rule of rules) {
        if (!rule.test(value, formData)) {
          if (field === 'Companies') {
            return (value as Company[]).map(() => ({
              Designation: 'Company details are invalid',
              CompanyName: 'Company details are invalid',
              StartDate: 'Company details are invalid',
              EndDate: 'Company details are invalid'
            }));
          } else if (field === 'Medias') {
            return {
              IntroVideo: 'Media is invalid',
              ProfilePhoto: 'Media is invalid'
            };
          }
          return rule.message as ErrorFor<FormData[K]>;
        }
      }
    }
    return null;
  }
  
  
  
  
export default signUpValidationRules;