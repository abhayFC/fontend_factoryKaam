import React, { createContext, useState, useContext, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { router, useSegments, useRootNavigationState } from "expo-router";
import axios from "axios";

// Type definitions
interface JobPreferences {
  preferredIndustries: string[];
  preferredRoles: string[];
  preferredLocations: string[];
  expectedSalaries: number;
}
interface BaseUser {
  _id: string;
  email: string;
  name: string;
  phone: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  created_at: string;
  updated_at: string;
  tokens: number;
  user_type: "manufacturer" | "factoryworker";
  profile_picture: string;
  connections: any[]; // You might want to define a more specific type for connections
}
interface Experience {
  startMonthYear: string | null;
  lastMonthYear: string | null;
  establishmentName: string;
}

interface ExperiencesResponse {
  pastExperiences: Experience[];
}

interface ManufacturerUser extends BaseUser {
  user_type: "manufacturer";
  company_name: string;
  contact_person_name: string;
  contact_person_number: string;
  gstin: string;
  industry: string;
  industry_updates_preference: boolean;
  location: string;
  referral_name?: string;
  referral_number?: string;
}

interface Education {
  high_school: {
    name: string;
    year: string;
  };
  diploma?: {
    name: string;
    year: string;
  };
  college?: {
    name: string;
    year: string;
  };
}

interface Experience {
  company_name: string;
  designation: string;
  start_date: string;
  end_date?: string;
}
type AcademicInfoEntry = {
  qualificationType: string;
  instituteName: string;
  specialization: string;
  passingYear: string;
};

interface FactoryWorkerUser extends BaseUser {
  user_type: "factoryworker";
  address: string;
  date_of_birth: string;
  education: Education;
  highest_education: string;
  industry_preferences: string[];
  industry_updates_preference: boolean;
  intro_video: {
    video_url: string;
  };
  job_updates_preference: boolean;
  open_to_relocation: boolean;
  profile_picture: string;
  referral: {
    name: string;
    number: string;
  };
  salary_range: string;
  working_hours_preference: string;
  experience: Experience[];
}

// Union type for User
type User = ManufacturerUser | FactoryWorkerUser;

type UserType = "individual" | "organisation" | "manufacturer";

type IndividualFormData = {
  Email: string;
  Password: string;
  PhoneNumber: string;
  FirstName: string;
  LastName: string;
  DateOfBirth: Date | null;
  Address: string;
  HighestEducation: string;
  HighSchoolName: string;
  DiplomaInstituteName: string;
  DiplomaGradYear: string;
  HighSchoolGradYear: string;
  CollegeName: string;
  CollegeGradYear: string;
  ReferralName: string;
  ReferralNumber: string;
  Companies: {
    Designation: string;
    CompanyName: string;
    StartDate: Date | null;
    EndDate: Date | null;
  }[];
  IntroVideo: {
    PhotoUri: string;
    VideoUri: string;
  };
  IndustryChoices: string;
  OpenToRelocation: string;
  SalaryRange: string;
  WorkingHours: string;
  JobUpdates: string;
  IndustryUpdates: string;
};

type OrganisationFormData = {
  Email: string;
  Password: string;
  PhoneNumber: string;
  OrganisationName: string;
  Address: string;
  ReferralName?: string;
  ReferralNumber?: string;
  GstNo: string;
  ContactPersonName: string;
  ContactPersonNumber: string;
  IndustryPreference: string;
  IndustryUpdates: string;
  ProfilePhotoUri?: string;
};

interface JobData {
  JobTitle: string;
  JobDescription: string;
  CompanyName: string;
  WorkPlaceType: string;
  location: string;
  WorkingHours: string;
  Salary: string;
  WorkingDays: string;
  Lodging: string;
  Food: string;
  PFandESI: string;
  Incentives: string;
  SkillsRequired: string[];
}

interface Community {
  _id: string;
  name: string;
  description: string;
  background_picture: string;
  profile_picture: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  openForEveryone: boolean;
  joinRequests: string[]; // Assuming this is an array of user IDs
  members: string[]; // Assuming this is an array of user IDs
}

interface CommunitiesResponse {
  communities: Community[];
}
type ExperienceData = {
  pastExperiences: {
    startMonthYear: string;
    lastMonthYear: string;
    establishmentName: string;
    currentIndrustry: string;
    Role: string;
    exitReason: string;
  }[];
  isCurrentlyWorking: boolean;
  salaryDrawn: number;
  totalExperience: string;
  currentExperience: {
    startMonthYear: string;
    establishmentName: string;
    address: {
      city: string;
      state: string;
    };
    currentIndrustry: string;
    Role: string;
  };
};

interface Job {
  _id: string;
  CompanyName: string;
  active: boolean;
  coupon_code: string | null;
  created_at: string;
  description: string;
  expiry_date: string;
  food_provided: boolean;
  incentives_provided: boolean;
  industry: string;
  location: string;
  lodging_provided: boolean;
  manufacturer_id: string;
  number_of_openings: number;
  payment_plan: string | null;
  payment_verified: boolean;
  pf_and_esi_provided: boolean;
  requirements: string;
  salary: string;
  title: string;
  type: string;
  updated_at: string;
  work_timings: {
    _id: string;
    days: string[];
    end_time: string;
    start_time: string;
  };
}

type JobsResponse = Job[];

type Post = {
  post: any;
  _id: string;
  comments: any[];
  community_id: null | string;
  content: string;
  created_at: string;
  image_url: string;
  likes: { _id: string }[];
  updated_at: string;
  user_name:string;
  user_id: string;
  user_profile_picture: string;
  video_url: string;
};

type PostsResponse = {
  currentPage: number;
  posts: Post[];
  totalPages: number;
  totalPosts: number;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginUsingOTP: (identifier: string, otp: string) => Promise<void>;
  signupIndividual: (data: FormData) => Promise<void>;
  signupOrganisation: (data: FormData) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  verifyPaymentAndActivateJob: (
    jobId: string,
    couponCode: string
  ) => Promise<any>;
  fetchUserProfile: () => Promise<any>;
  postJob: (jobData: JobData) => Promise<any>;
  fetchJobsForOrganisation: () => Promise<Job[]>;
  fetchJobs: () => Promise<Job[]>;
  createPost: (postData: FormData) => Promise<void>;
  updateUserProfile: (data: FormData) => Promise<any>;
  getCommunities: () => Promise<CommunitiesResponse>;
  joinCommunity: (communityId: string) => Promise<void>;
  fetchAvailableConnections: () => Promise<any>;
  applyForJob: (jobId: string) => Promise<void>;
  getPostsByUser: () => Promise<PostsResponse>;
  likePost: (postId: string) => Promise<any>;
  unlikePost: (postId: string) => Promise<any>;
  addComment: (postId: string, content: string) => Promise<Post>;
  getUsername: (userId: string) => Promise<string>;
  initiateRegistration: (phone: string) => Promise<any>;
  verifyLoginOTPForJobSeeker: (JobSeekerId: string, otp: string) => Promise<any>;
  PersonalInfoUpdate:(name:string, address:string, dob:string,isfresher:boolean)=>Promise<any>;
  AcademicInfoUpdate:(AcademicInfo:AcademicInfoEntry[])=>Promise<any>;
  VerifyGST:(gst:string)=>Promise<any>;
  initiateRegistrationForEmployer: (phone: string) => Promise<any>;
  verifyLoginOTPForEmployer: (manufacturerId: string, otp: string) => Promise<any>;
  BasicDetailsUpdate:(gstin:string,email:string,password:string,company_name:string,industry:string,address:string)=>Promise<any>;
  ContactInfoUpdate:(formData:FormData)=>Promise<any>;
  updateJobPreferences(data:JobPreferences):Promise<any>;
  updateExperience: (data: ExperienceData) => Promise<any>;
  getExperiences: () => Promise<ExperiencesResponse>;

};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = "https://apis.factorykaam.com/api"; // Replace with your actual API base URL

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const rootSegment = useSegments()[0];
  const navigationState = useRootNavigationState();

  useEffect(() => {
    loadStoredAuthData();
  }, []);

  const loadStoredAuthData = async () => {
    setIsLoading(true);
    try {
      const storedToken = await SecureStore.getItemAsync("userToken");
      const storedUser = await SecureStore.getItemAsync("userData");

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error loading stored auth data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setAuthData = async (newToken: string, userData: User) => {
    setToken(newToken);
    setUser(userData);
    await SecureStore.setItemAsync("userToken", newToken);
    await SecureStore.setItemAsync("userData", JSON.stringify(userData));
  };

  useEffect(() => {
    if (token) {
      console.log("Setting token in axios:", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const setAuthToken = async (newToken: string) => {
    setToken(newToken);
    await SecureStore.setItemAsync("userToken", newToken);
  };

  const clearAuthData = async () => {
    setToken(null);
    setUser(null);
    await SecureStore.deleteItemAsync("userToken");
    await SecureStore.deleteItemAsync("userData");
  };

  const checkToken = async () => {
    setIsLoading(true);
    try {
      const storedToken = await SecureStore.getItemAsync("userToken");
      if (storedToken) {
        setToken(storedToken);
        const userData = await fetchUserData(storedToken);
        setUser(userData);
      }
    } catch (error) {
      console.error("Error checking token:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const initiateRegistration = async (phone:string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/job-seekers/initiate`, { phone });
      console.log("Initiate registration response:", response.data);
      return response.data;
    } catch (error) {
      console.error('Initiate registration error:', error);
      throw error;
    }
  };
  const initiateRegistrationForEmployer = async (phone:string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/employers/`, { phone });
      console.log("Initiate registration response:", response.data);
      return response.data;
    } catch (error) {
      console.error('Initiate registration error:', error);
      throw error;
    }
  };
  const verifyLoginOTPForEmployer = async (manufacturerId:string, otp:string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/employers/verify-login-otp`, { "manufacturerId": manufacturerId, "otp": otp });
      if (response.data.token) {
        await setAuthToken(response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Verify OTP error:', error);
      throw error;
    }
  };
  const verifyLoginOTPForJobSeeker = async (JobSeekerId:string, otp:string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/job-seekers/verify-login-otp`, { "userId": JobSeekerId, "otp": otp });
      if (response.data.token) {
        await setAuthToken(response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Verify OTP error:', error);
      throw error;
    }
  };
  const PersonalInfoUpdate=async(name:string, address:string, dob:string,isfresher:boolean)=>{
    try{
      console.log("Data received in PersonalInfoUpdate:", name, address, dob, isfresher);
      const response=await axios.post(`${API_BASE_URL}/job-seekers/personal-info`, {"name":name,"dob":dob,"address":address,"isfresher":isfresher}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    }catch(error){
      console.error('Error updating personal info:', error);
      throw error

    }  
  }
  const AcademicInfoUpdate=async(AcademicInfo:AcademicInfoEntry[])=>{
    try{
      const response=await axios.post(`${API_BASE_URL}/job-seekers/academic-info`, {"academicInfo":AcademicInfo}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    }catch(error){
      console.error('Error updating academic info:', error);
      throw error

    }
  }
  const VerifyGST=async(gst:string)=>{
    try{
      const response=await axios.post(`${API_BASE_URL}/employers/verify-gstin`, {"gstin":gst}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    }catch(error){
      console.error('Error in verifying gst:', error);
      throw error

    }
  }
  const getExperiences = async (): Promise<ExperiencesResponse> => {
    try {
      const response = await axios.get<ExperiencesResponse>(
        `${API_BASE_URL}/job-seekers/getexperiences`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching experiences:", error);
      throw error;
    }
  };


  const updateExperience = async (data: ExperienceData): Promise<any> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/job-seekers/experiences`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating experience:", error);
      throw error;
    }
  };
  const BasicDetailsUpdate=async(gstin:string,email:string,password:string,company_name:string,industry:string,address:string)=>{
    try{
      console.log("Data received in BasicDetailsUpdate:", gstin,email,password,company_name,industry,address);
      const response=await axios.post(`${API_BASE_URL}/employers/register`, {"gstin":gstin, "email":email,"password":password,"company_name":company_name,"industry":industry,"address":address}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    }catch(error){
      console.error('Error updating basic info:', error);
      throw error

    }
  }
  // {
  //   "contactPersonName": "John Doe",
  //   "contactPersonNumber": "9876543210",
  //   "contactPersonDesignation": "Operations Manager",
  //   "contactPersonEmail": "john.doe@example.com",
  //   "companyDescription": "Leading textile manufacturer specializing in sustainable fabrics and innovative designs. Established in 1995, we've been at the forefront of the industry, combining traditional techniques with modern technology."
  // }
  const ContactInfoUpdate=async(formData:FormData)=>{
    try{
      console.log("Form data forn auth:", formData);
      const response=await axios.post(`${API_BASE_URL}/employers/profile-photo`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data'
      },
      });
      return response.data;
    }catch(error){
      console.error('Error updating contact info:', error);
      throw error

    }
  }
  const login = async (identifier: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        identifier,
        password,
      });
      const { token, user } = response.data;
      await setAuthData(token, user);
      router.replace("/home");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginUsingOTP = async (identifier: string, otp: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/verify-login-otp`,
        { identifier, otp }
      );
      const { token, user } = response.data;
      await setAuthData(token, user);
      router.replace("/home");
    } catch (error) {
      console.error("OTP Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signupIndividual = async (data: FormData) => {
    setIsLoading(true);
    try {
      console.log("Data received in signupIndividual:", data);
      const response = await axios.post(`${API_BASE_URL}/factory-workers`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (error) {
      console.error('Error signing up individual:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };


  const signupOrganisation = async (data: FormData) => {
    setIsLoading(true);
    try {
      console.log("Data received in signupOrganisation:", data);
      const response = await axios.post(`${API_BASE_URL}/manufacturers`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      console.log('Signup response:', response.data);
      // Handle successful signup (e.g., set user state, store token, etc.)
      return response.data;
    } catch (error) {
      console.error('Error signing up organisation:', error);
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 409) {
          throw new Error('Email or phone number already in use. Please use a different email or phone number.');
        } else {
          throw new Error(error.response.data.error || 'An error occurred during signup. Please try again.');
        }
      } else {
        throw new Error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }; 

  const logout = async () => {
    try {
      await clearAuthData();
      router.replace("(auth)/SignIn");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const postJob = async (jobData: JobData): Promise<any> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/jobs`, jobData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error posting job:", error);
      throw error;
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/profile`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  };

  const fetchJobs = async (): Promise<JobsResponse> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching jobs:", error);
      throw error;
    }
  };

  const createPost = async (formData: FormData): Promise<void> => {
    setIsLoading(true);
    try {
      console.log("Creating post:", formData);
      const response = await axios.post(`${API_BASE_URL}/posts`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Post created successfully:", response.data);
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchJobsForOrganisation = async (): Promise<Job[]> => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/jobs/manufacturer/jobs`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Jobs for organisation:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching jobs:", error);
      throw error;
    }
  };

  const getCommunities = async (): Promise<CommunitiesResponse> => {
    try {
      const response = await axios.get<CommunitiesResponse>(
        `${API_BASE_URL}/communities/available`
      );
      console.log("Communities:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching communities:", error);
      throw error;
    }
  };

  const joinCommunity = async (communityId: string) => {
    try {
      const formData = new FormData();
      formData.append("communityId", communityId);
      const response = await axios.post(
        `${API_BASE_URL}/communities/join`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Community joined successfully:", response.data);
    } catch (error) {
      console.error("Error joining community:", error);
      throw error;
    }
  };

  const updateUserProfile = async (data: FormData) => {
    try {
      console.log("Updating user profile with data:", token,"\n",data);
      const response = await axios.post(`${API_BASE_URL}/job-seekers/profile-media`, data,{
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },}
      );
      return response.data;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  };
  const updateJobPreferences = async (data: JobPreferences) => {
    try {
      console.log("Updating job preferences with data:", data);
      const response = await axios.post(`${API_BASE_URL}/job-seekers/preferences`, {"jobPreferences":data}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating job preferences:", error);
      throw error;
    }
  };  
  const verifyPaymentAndActivateJob = async (
    jobId: string,
    couponCode: string
  ): Promise<any> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/jobs/verify-payment`,
        {
          jobId,
          couponCode,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error verifying payment and activating job:", error);
      throw error;
    }
  };

  const fetchAvailableConnections = async (): Promise<any> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Connections:", response.data.users);
      return response.data.users;
    } catch (error) {
      console.error("Error fetching available connections:", error);
      throw error;
    }
  };

  const applyForJob = async (job_id: string) => {
    try {
      await axios.post(`${API_BASE_URL}/applications/apply`, {"job_id":job_id}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Error applying for job:", error);
      throw error;
    }
  };

  const getPostsByUser = async (): Promise<PostsResponse> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/posts/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Posts response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching posts by user:", error);
      throw error;
    }
  };

  const likePost = async (postId: string) => {
    try {
      console.log(postId);
      const response = await axios.post(
        `${API_BASE_URL}/posts/${postId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error liking post:", error);
      throw error;
    }
  };

  const unlikePost = async (postId: string) => {
    try {
      console.log(postId);
      const response = await axios.post(
        `${API_BASE_URL}/posts/${postId}/unlike`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error unliking post:", error);
      throw error;
    }
  };
  const getUsername = async (userId: string): Promise<string> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/${userId}/username`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.username;
    } catch (error) {
      console.error("Error fetching username:", error);
      return "Unknown User";
    }
  };


  const addComment = async (postId: string, comment: string): Promise<Post> => {
    try {
      console.log("Sending comment data:", { postId, comment });
      const response = await axios.post(
        `${API_BASE_URL}/posts/${postId}/comment`,
        { comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error response:", error.response?.data);
        console.error("Error request:", error.request);
        console.error("Error config:", error.config);
        const errorMessage =
          error.response?.data?.errors?.[0]?.msg || "Failed to add comment";
        throw new Error(errorMessage);
      }
      throw error;
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        verifyLoginOTPForJobSeeker,
        updateExperience,
        initiateRegistration,
        user,
        AcademicInfoUpdate,
        token,
        getExperiences,
        login,
        loginUsingOTP,
        signupIndividual,
        signupOrganisation,
        logout,
        isLoading,
        verifyPaymentAndActivateJob,
        fetchUserProfile,
        updateUserProfile,
        postJob,
        fetchJobsForOrganisation,
        fetchJobs,
        createPost,
        getCommunities,
        updateJobPreferences,
        joinCommunity,
        fetchAvailableConnections,
        applyForJob,
        getPostsByUser,
        likePost,
        unlikePost,
        getUsername,
        addComment,
        PersonalInfoUpdate,
        VerifyGST,
        initiateRegistrationForEmployer,
        verifyLoginOTPForEmployer,
        BasicDetailsUpdate,
        ContactInfoUpdate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

async function fetchUserData(token: string): Promise<User> {
  const response = await axios.get(`${API_BASE_URL}/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}
