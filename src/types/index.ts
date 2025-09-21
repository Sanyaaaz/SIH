export interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  duration: string;
  stipend: string;
  description: string;
  requirements: string[];
  skills: string[];
  type: 'Full-time' | 'Part-time' | 'Remote';
  postedDate: string;
  applicationDeadline: string;
  companyLogo?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  appliedInternships: string[];
  profile?: {
    resume?: string;
    phone?: string;
    university?: string;
  };
}

export interface Application {
  id: string;
  userId: string;
  internshipId: string;
  appliedDate: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
}