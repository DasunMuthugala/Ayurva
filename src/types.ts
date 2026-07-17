export type UserRole = "Admin" | "Instructor" | "Receptionist";

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
  phone: string;
  isActive: boolean;
}

export interface StudentMedicalHistory {
  bloodPressure: "Normal" | "High" | "Low";
  diabetes: boolean;
  heartProblems: boolean;
  backPain: boolean;
  pregnancy: boolean;
  surgeries: string; // Describe surgery history
  injuries: string; // Describe injury history
  medications: string; // Describe current medications
  doctorNotes: string; // Private doctor guidelines
}

export interface StudentHealthAssessment {
  lifestyle: string;
  stressLevel: "Low" | "Moderate" | "High";
  sleepQuality: "Poor" | "Normal" | "Excellent";
  waterIntake: "Low" | "Normal" | "High";
  exerciseFrequency: "Rarely" | "Sometimes" | "Often" | "Daily";
  diet: string;
  smoking: boolean;
  alcohol: boolean;
  painAreas: string[];
  fitnessLevel: number; // 1-10
  flexibilityScore: number; // 1-10
  breathingScore: number; // 1-10
  balanceScore: number; // 1-10
  meditationExperience: "None" | "Beginner" | "Regular";
  healthRisks: string[];
  recommendations: string;
}

export interface BodyMeasurements {
  weight: number; // kg
  height: number; // cm
  bmi: number;
  chest?: number; // inches
  waist?: number; // inches
  hips?: number; // inches
}

export interface StudentProgressEntry {
  id: string;
  studentId: string;
  date: string;
  weight: number;
  bmi: number;
  flexibilityScore: number; // 1-10
  breathingScore: number; // 1-10
  balanceScore: number; // 1-10
  meditationMinutes: number;
  attendanceTrend: number; // Checked classes in last 30d
  goalAchievement: string; // Percentage or status text
  photoUrl?: string; // Simulated comparison photo
  instructorNotes: string;
}

export interface Student {
  id: string; // Student ID
  qrCodeUrl: string; // Data URI or URL representation
  photoUrl: string; // Avatar URL
  fullName: string;
  gender: "Male" | "Female" | "Other";
  dateOfBirth: string;
  age: number;
  nicOrPassport: string;
  occupation: string;
  address: string;
  city: string;
  district: string;
  phone: string;
  whatsApp: string;
  email: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  classId?: string;
  className?: string;
  
  // Medical & Health
  medicalConditions: StudentMedicalHistory;
  yogaExperience: "None" | "Beginner" | "Intermediate" | "Advanced";
  goals: string;
  
  // Health assessment & Body stats
  assessment: StudentHealthAssessment;
  measurements: BodyMeasurements;
  
  // Status
  status: "Active" | "Inactive" | "Paused" | "Deleted";
  registrationDate: string;
  membershipType: string;
  notes: string; // Public student notes
  privateNotes: string; // Private notes visible ONLY to instructors/admins
  
  // Attached Documents
  documents: {
    id: string;
    name: string;
    type: "Medical Report" | "Consent Form" | "ID Copy" | "Invoice" | "Certificate";
    uploadDate: string;
    fileUrl: string;
  }[];
}

export interface Membership {
  id: string;
  studentId: string;
  studentName: string;
  type: string;
  startDate: string;
  endDate: string;
  remainingDays: number;
  remainingClasses: number; // for class-based passes
  status: "Active" | "Expired" | "Paused" | "Frozen";
  autoRenewal: boolean;
  price: number;
}

export interface Attendance {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  date: string;
  status: "Present" | "Absent" | "Late" | "Excused" | "Holiday";
  checkInTime: string;
  method: "Manual" | "QR Code" | "PIN" | "Search";
  instructorNotes?: string;
}

export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  date: string;
  method: "Cash" | "Card" | "Bank Transfer" | "Online Payment";
  status: "Paid" | "Pending" | "Refunded" | "Outstanding";
  membershipType: string;
  discountCode?: string;
  discountAmount?: number;
  installmentNo?: number;
  totalInstallments?: number;
  outstandingBalance: number;
  lateFee: number;
  invoiceNo: string;
}

export interface ClassSchedule {
  id: string;
  name: string; // e.g. "Morning Hatha Yoga"
  instructorId: string;
  instructorName: string;
  dayOfWeek: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  startTime: string; // "06:30"
  endTime: string; // "07:30"
  type: "Morning Classes" | "Evening Classes" | "Weekend Classes" | "Special Workshops" | "Meditation Sessions" | "Prenatal Yoga" | "Kids Yoga" | "Private Sessions" | "Online Classes";
  capacity: number;
  enrolledCount: number;
  waitingListCount: number;
  isRecurring: boolean;
  city: string; // e.g. "Mirigama", "Minuwangoda", "Gampaha", "Miriswatta"
}

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  source: "Facebook" | "Instagram" | "Google" | "Website" | "Walk-in";
  status: "Interested" | "Trial" | "Joined" | "Rejected";
  date: string;
  notes: string;
  followUpDate: string;
}

export interface TrialClass {
  id: string;
  studentName: string;
  phone: string;
  type: "Free Trial" | "Paid Trial";
  classId: string;
  className: string;
  date: string;
  attendanceStatus: "Attended" | "Absent";
  feedback: string;
  converted: boolean;
}

export interface Expense {
  id: string;
  category: "Rent" | "Utilities" | "Salaries" | "Marketing" | "Equipment" | "Maintenance" | "Supplies";
  description: string;
  amount: number;
  date: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  username: string;
  role: UserRole;
  action: string; // e.g. "Create Student", "Update Payment", "Mark Attendance"
  details: string;
}

export interface BusinessSettings {
  businessName: string;
  logoUrl: string;
  address: string;
  phone: string;
  email: string;
  whatsAppNum: string;
  socials: {
    facebook: string;
    instagram: string;
    website: string;
  };
  businessHours: string;
  taxPercentage: number;
  currency: string;
  timeZone: string;
  language: "English" | "Sinhala";
}
