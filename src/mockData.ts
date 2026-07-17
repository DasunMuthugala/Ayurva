import { 
  Student, 
  Membership, 
  Attendance, 
  Payment, 
  ClassSchedule, 
  Inquiry, 
  TrialClass, 
  Expense, 
  AuditLog, 
  BusinessSettings,
  StudentProgressEntry
} from "./types";

export const mockUsers = [
  { id: "u-1", username: "kumodya", fullName: "Kumodya Dilshani", email: "kumodya@ayurvayoga.com", role: "Admin" as const, phone: "+94 77 123 4567", isActive: true },
  { id: "u-2", username: "dilani", fullName: "Dilani Silva", email: "dilani@ayurvayoga.com", role: "Instructor" as const, phone: "+94 71 888 2345", isActive: true },
  { id: "u-3", username: "chamani", fullName: "Chamani De Silva", email: "chamani@ayurvayoga.com", role: "Receptionist" as const, phone: "+94 72 555 6789", isActive: true }
];

export const mockSettings: BusinessSettings = {
  businessName: "Ayurva Yoga & Wellness by Kumodya",
  logoUrl: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=200",
  address: "No 45, Flower Road, Colombo 07, Sri Lanka",
  phone: "+94 11 234 5678",
  email: "info@ayurvayoga.com",
  whatsAppNum: "+94771234567",
  socials: {
    facebook: "https://facebook.com/ayurvayoga",
    instagram: "https://instagram.com/ayurvayoga",
    website: "https://ayurvayoga.com"
  },
  businessHours: "Monday - Friday: 06:00 AM - 08:30 PM | Saturday - Sunday: 07:00 AM - 06:00 PM",
  taxPercentage: 0,
  currency: "LKR",
  timeZone: "GMT+5:30 (Sri Lanka)",
  language: "English"
};

export const mockClasses: ClassSchedule[] = [
  { id: "c-1", name: "Morning Hatha Flow", instructorId: "u-1", instructorName: "Kumodya Dilshani", dayOfWeek: "Monday", startTime: "06:30", endTime: "07:30", type: "Morning Classes", capacity: 25, enrolledCount: 22, waitingListCount: 0, isRecurring: true, city: "Gampaha" },
  { id: "c-2", name: "Spine & Back Care Yoga", instructorId: "u-1", instructorName: "Kumodya Dilshani", dayOfWeek: "Monday", startTime: "17:30", endTime: "18:30", type: "Evening Classes", capacity: 20, enrolledCount: 19, waitingListCount: 2, isRecurring: true, city: "Mirigama" },
  { id: "c-3", name: "Pranayama & Meditation", instructorId: "u-2", instructorName: "Dilani Silva", dayOfWeek: "Tuesday", startTime: "06:00", endTime: "07:00", type: "Meditation Sessions", capacity: 30, enrolledCount: 28, waitingListCount: 0, isRecurring: true, city: "Minuwangoda" },
  { id: "c-4", name: "Ashtanga Primary Series", instructorId: "u-1", instructorName: "Kumodya Dilshani", dayOfWeek: "Wednesday", startTime: "06:30", endTime: "08:00", type: "Morning Classes", capacity: 15, enrolledCount: 15, waitingListCount: 3, isRecurring: true, city: "Miriswatta" },
  { id: "c-5", name: "Prenatal Gentle Yoga", instructorId: "u-2", instructorName: "Dilani Silva", dayOfWeek: "Thursday", startTime: "10:00", endTime: "11:00", type: "Prenatal Yoga", capacity: 12, enrolledCount: 8, waitingListCount: 0, isRecurring: true, city: "Gampaha" },
  { id: "c-6", name: "Vinyasa Flow Advanced", instructorId: "u-1", instructorName: "Kumodya Dilshani", dayOfWeek: "Friday", startTime: "18:00", endTime: "19:30", type: "Evening Classes", capacity: 20, enrolledCount: 14, waitingListCount: 0, isRecurring: true, city: "Mirigama" },
  { id: "c-7", name: "Weekend Sunset Yoga", instructorId: "u-2", instructorName: "Dilani Silva", dayOfWeek: "Saturday", startTime: "16:30", endTime: "18:00", type: "Weekend Classes", capacity: 35, enrolledCount: 32, waitingListCount: 0, isRecurring: true, city: "Minuwangoda" },
  { id: "c-8", name: "Kids Yoga & Mindfulness", instructorId: "u-2", instructorName: "Dilani Silva", dayOfWeek: "Sunday", startTime: "09:00", endTime: "10:15", type: "Kids Yoga", capacity: 15, enrolledCount: 11, waitingListCount: 0, isRecurring: true, city: "Miriswatta" },
  { id: "c-9", name: "Sound Healing Workshop", instructorId: "u-1", instructorName: "Kumodya Dilshani", dayOfWeek: "Saturday", startTime: "10:00", endTime: "12:30", type: "Special Workshops", capacity: 40, enrolledCount: 38, waitingListCount: 5, isRecurring: false, city: "Gampaha" }
];

export const mockStudents: Student[] = [
  {
    id: "AYUR-2026-001",
    qrCodeUrl: "AYUR-2026-001",
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    fullName: "Nimasha Fernando",
    gender: "Female",
    dateOfBirth: "1994-04-12",
    age: 32,
    nicOrPassport: "199454120392",
    occupation: "Software Engineer",
    address: "32/1, Nawala Road",
    city: "Bandarawatta",
    district: "Gampaha",
    phone: "+94 77 345 6789",
    whatsApp: "+94773456789",
    email: "nimasha.f@gmail.com",
    emergencyContactName: "Sumith Fernando",
    emergencyContactPhone: "+94 71 222 3456",
    emergencyContactRelation: "Spouse",
    classId: "c-1",
    className: "Morning Hatha Flow",
    
    medicalConditions: {
      bloodPressure: "Normal",
      diabetes: false,
      heartProblems: false,
      backPain: true,
      pregnancy: false,
      surgeries: "None",
      injuries: "Occasional lower back stiffness due to sitting all day.",
      medications: "None",
      doctorNotes: "Avoid severe hyper-extensions of the lumbar spine."
    },
    yogaExperience: "Beginner",
    goals: "Relieve chronic back pain and manage work stress",
    
    assessment: {
      lifestyle: "Desk job, 9 hours of sitting daily.",
      stressLevel: "High",
      sleepQuality: "Poor",
      waterIntake: "Low",
      exerciseFrequency: "Rarely",
      diet: "Mixed organic Sri Lankan diet, high carbs",
      smoking: false,
      alcohol: false,
      painAreas: ["Lower Back", "Shoulders"],
      fitnessLevel: 4,
      flexibilityScore: 3,
      breathingScore: 5,
      balanceScore: 4,
      meditationExperience: "None",
      healthRisks: ["Sedentary lifestyle", "Lumbar muscular strain"],
      recommendations: "Spine decompression postures, shoulder openers, and Nadi Shodhana pranayama."
    },
    measurements: {
      weight: 62,
      height: 165,
      bmi: 22.8,
      chest: 34,
      waist: 28,
      hips: 37
    },
    status: "Active",
    registrationDate: "2026-01-15",
    membershipType: "Monthly Pass",
    notes: "Prefers evening classes. Highly receptive to meditation.",
    privateNotes: "Progressing slowly on flexibility. Lower back pain acts up if holding Cobra pose too long. Keep blocks under knees in child's pose.",
    documents: [
      { id: "doc-1", name: "Consent Form.pdf", type: "Consent Form", uploadDate: "2026-01-15", fileUrl: "#" },
      { id: "doc-2", name: "NIC_Nimasha.pdf", type: "ID Copy", uploadDate: "2026-01-15", fileUrl: "#" }
    ]
  },
  {
    id: "AYUR-2026-002",
    qrCodeUrl: "AYUR-2026-002",
    photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150",
    fullName: "Aruni Rajapaksha",
    gender: "Female",
    dateOfBirth: "1991-08-23",
    age: 34,
    nicOrPassport: "199168234821",
    occupation: "Architect",
    address: "48, Galle Road",
    city: "Mirigama Road",
    district: "Mirigama",
    phone: "+94 71 876 5432",
    whatsApp: "+94718765432",
    email: "aruni.rajapaksha@outlook.com",
    emergencyContactName: "Manjula Rajapaksha",
    emergencyContactPhone: "+94 77 888 1122",
    emergencyContactRelation: "Father",
    classId: "c-2",
    className: "Spine & Back Care Yoga",
    
    medicalConditions: {
      bloodPressure: "High",
      diabetes: false,
      heartProblems: false,
      backPain: false,
      pregnancy: true,
      surgeries: "None",
      injuries: "None",
      medications: "Doctor-approved prenatal vitamins",
      doctorNotes: "In second trimester. Avoid lying flat on abdomen and avoid breath-holding (Kumbhaka)."
    },
    yogaExperience: "Intermediate",
    goals: "Maintain flexibility and mental peace during pregnancy",
    
    assessment: {
      lifestyle: "Active, but works long hours. Enjoys walking.",
      stressLevel: "Moderate",
      sleepQuality: "Normal",
      waterIntake: "Normal",
      exerciseFrequency: "Sometimes",
      diet: "Vegetarian",
      smoking: false,
      alcohol: false,
      painAreas: ["Hips"],
      fitnessLevel: 6,
      flexibilityScore: 6,
      breathingScore: 7,
      balanceScore: 5,
      meditationExperience: "Beginner",
      healthRisks: ["Mild gestational hypertension risk"],
      recommendations: "Prenatal yoga, hip openers, side stretches, and deep abdominal breathing."
    },
    measurements: {
      weight: 68,
      height: 160,
      bmi: 26.6,
      chest: 36,
      waist: 32,
      hips: 40
    },
    status: "Active",
    registrationDate: "2026-02-10",
    membershipType: "Monthly Pass",
    notes: "Requires bolster and blocks for all seated poses.",
    privateNotes: "Very positive energy. Do not stretch joints to their extreme limit due to high relaxin hormone levels.",
    documents: [
      { id: "doc-3", name: "Pregnancy Medical Certificate.pdf", type: "Medical Report", uploadDate: "2026-02-10", fileUrl: "#" },
      { id: "doc-4", name: "Signed_Consent.pdf", type: "Consent Form", uploadDate: "2026-02-10", fileUrl: "#" }
    ]
  },
  {
    id: "AYUR-2026-003",
    qrCodeUrl: "AYUR-2026-003",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    fullName: "Kasun Jayasundara",
    gender: "Male",
    dateOfBirth: "1988-11-05",
    age: 37,
    nicOrPassport: "198831050212",
    occupation: "Bank Manager",
    address: "15/A, Kandy Road",
    city: "Minuwangoda Town",
    district: "Minuwangoda",
    phone: "+94 75 999 4455",
    whatsApp: "+94759994455",
    email: "kasunjay88@yahoo.com",
    emergencyContactName: "Dilini Jayasundara",
    emergencyContactPhone: "+94 77 111 2233",
    emergencyContactRelation: "Spouse",
    classId: "c-3",
    className: "Pranayama & Meditation",
    
    medicalConditions: {
      bloodPressure: "High",
      diabetes: true,
      heartProblems: false,
      backPain: false,
      pregnancy: false,
      surgeries: "Knee arthroscopy in 2022",
      injuries: "Left knee ligament strain history. Restricted deep knee flexion.",
      medications: "Metformin 500mg daily, Losartan 50mg daily",
      doctorNotes: "Knee must not be loaded under extreme flexion. Watch heart rate spikes."
    },
    yogaExperience: "None",
    goals: "Lower high blood pressure, regulate blood sugar, lose weight",
    
    assessment: {
      lifestyle: "High stress corporate job, irregular eating habits.",
      stressLevel: "High",
      sleepQuality: "Poor",
      waterIntake: "Low",
      exerciseFrequency: "Rarely",
      diet: "Heavy oil and high carbohydrate intake",
      smoking: true,
      alcohol: true,
      painAreas: ["Left Knee", "Neck"],
      fitnessLevel: 3,
      flexibilityScore: 2,
      breathingScore: 3,
      balanceScore: 3,
      meditationExperience: "None",
      healthRisks: ["Cardiovascular risk", "Joint strain"],
      recommendations: "Supported Warrior poses, gentle neck stretches, cooling pranayama (Sheetali), and yoga nidra."
    },
    measurements: {
      weight: 89,
      height: 174,
      bmi: 29.4,
      chest: 42,
      waist: 38,
      hips: 42
    },
    status: "Active",
    registrationDate: "2026-03-01",
    membershipType: "Private Session",
    notes: "Requires a chair or block for balancing poses. Always keep a towel handy.",
    privateNotes: "BP is high. Must check pulse if he feels dizzy. Left knee is very stiff, never force Vajrasana.",
    documents: [
      { id: "doc-5", name: "Medical Record_BP_Diabetes.pdf", type: "Medical Report", uploadDate: "2026-03-01", fileUrl: "#" }
    ]
  },
  {
    id: "AYUR-2026-004",
    qrCodeUrl: "AYUR-2026-004",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    fullName: "Pooja de Alwis",
    gender: "Female",
    dateOfBirth: "1999-07-15",
    age: 27,
    nicOrPassport: "199969710340",
    occupation: "Digital Marketer",
    address: "102, Lake Road",
    city: "Miriswatta Junction",
    district: "Miriswatta",
    phone: "+94 77 444 8899",
    whatsApp: "+94774448899",
    email: "pooja.dealwis@gmail.com",
    emergencyContactName: "Rohan de Alwis",
    emergencyContactPhone: "+94 77 121 2121",
    emergencyContactRelation: "Father",
    classId: "c-4",
    className: "Ashtanga Primary Series",
    
    medicalConditions: {
      bloodPressure: "Normal",
      diabetes: false,
      heartProblems: false,
      backPain: false,
      pregnancy: false,
      surgeries: "None",
      injuries: "None",
      medications: "None",
      doctorNotes: "None"
    },
    yogaExperience: "Advanced",
    goals: "Master advanced inversions and improve hip flexibility",
    
    assessment: {
      lifestyle: "Active lifestyle, gym and yoga practitioner.",
      stressLevel: "Low",
      sleepQuality: "Excellent",
      waterIntake: "High",
      exerciseFrequency: "Daily",
      diet: "Clean whole foods diet",
      smoking: false,
      alcohol: false,
      painAreas: [],
      fitnessLevel: 9,
      flexibilityScore: 9,
      breathingScore: 9,
      balanceScore: 8,
      meditationExperience: "Regular",
      healthRisks: [],
      recommendations: "Advanced Vinyasa flow, handstand and arm balance sequencing, restorative practice to cool down."
    },
    measurements: {
      weight: 54,
      height: 168,
      bmi: 19.1,
      chest: 32,
      waist: 25,
      hips: 34
    },
    status: "Active",
    registrationDate: "2025-05-10",
    membershipType: "Monthly Pass",
    notes: "Assists Kumodya with demo poses occasionally. Active community member.",
    privateNotes: "Superb alignment in backbends. Working on core strength for longer Pincha holding.",
    documents: []
  },
  {
    id: "AYUR-2026-005",
    qrCodeUrl: "AYUR-2026-005",
    photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150",
    fullName: "Roshan Gunawardena",
    gender: "Male",
    dateOfBirth: "1975-02-18",
    age: 51,
    nicOrPassport: "197504921432",
    occupation: "Business Owner",
    address: "77/4, Horana Road",
    city: "Gampaha Road",
    district: "Gampaha",
    phone: "+94 76 111 8888",
    whatsApp: "+94761118888",
    email: "roshan.guna@yahoo.com",
    emergencyContactName: "Manel Gunawardena",
    emergencyContactPhone: "+94 38 223 4567",
    emergencyContactRelation: "Mother",
    classId: "c-5",
    className: "Prenatal Gentle Yoga",
    
    medicalConditions: {
      bloodPressure: "High",
      diabetes: false,
      heartProblems: true,
      backPain: false,
      pregnancy: false,
      surgeries: "Stent insertion in 2024",
      injuries: "Shoulder impingement in left arm.",
      medications: "Atorvastatin 20mg, Aspirin 75mg, Bisoprolol 2.5mg",
      doctorNotes: "Strictly avoid high intensity cardio and hot rooms. Keep yoga extremely gentle, breathing must be smooth."
    },
    yogaExperience: "None",
    goals: "Cardiovascular health, stress reduction, and shoulder joint mobility",
    
    assessment: {
      lifestyle: "High pressure business owner, heavy work travels.",
      stressLevel: "High",
      sleepQuality: "Poor",
      waterIntake: "Normal",
      exerciseFrequency: "Rarely",
      diet: "Hotel catering, rich spicy food",
      smoking: false,
      alcohol: true,
      painAreas: ["Left Shoulder"],
      fitnessLevel: 2,
      flexibilityScore: 2,
      breathingScore: 4,
      balanceScore: 4,
      meditationExperience: "None",
      healthRisks: ["Post-cardiac rehabilitation caution", "Shoulder restriction"],
      recommendations: "Supported Restorative Yoga, gentle joint mobilization (Sukshma Vyayama), and extended Savasana."
    },
    measurements: {
      weight: 84,
      height: 170,
      bmi: 29.1,
      chest: 44,
      waist: 40,
      hips: 41
    },
    status: "Inactive",
    registrationDate: "2025-10-12",
    membershipType: "Drop-in Pass",
    notes: "Paused due to doctor instructions. Restarting slowly in August.",
    privateNotes: "Knees are fine. Left shoulder has very limited overhead extension, keep arms in a wider 'V' in Mountain pose.",
    documents: [
      { id: "doc-6", name: "Cardiology Clearance.pdf", type: "Medical Report", uploadDate: "2025-10-12", fileUrl: "#" }
    ]
  }
];

export const mockMemberships: Membership[] = [
  { id: "m-1", studentId: "AYUR-2026-001", studentName: "Nimasha Fernando", type: "Monthly Pass", startDate: "2026-07-01", endDate: "2026-08-01", remainingDays: 16, remainingClasses: 99, status: "Active", autoRenewal: true, price: 3500 },
  { id: "m-2", studentId: "AYUR-2026-002", studentName: "Aruni Rajapaksha", type: "Monthly Pass", startDate: "2026-06-15", endDate: "2026-07-15", remainingDays: 0, remainingClasses: 0, status: "Expired", autoRenewal: false, price: 3500 },
  { id: "m-3", studentId: "AYUR-2026-003", studentName: "Kasun Jayasundara", type: "Private Session", startDate: "2026-06-01", endDate: "2026-09-01", remainingDays: 47, remainingClasses: 24, status: "Active", autoRenewal: true, price: 4000 },
  { id: "m-4", studentId: "AYUR-2026-004", studentName: "Pooja de Alwis", type: "Monthly Pass", startDate: "2026-01-01", endDate: "2026-12-31", remainingDays: 168, remainingClasses: 999, status: "Active", autoRenewal: true, price: 3500 },
  { id: "m-5", studentId: "AYUR-2026-005", studentName: "Roshan Gunawardena", type: "Drop-in Pass", startDate: "2026-05-01", endDate: "2026-06-01", remainingDays: 0, remainingClasses: 0, status: "Frozen", autoRenewal: false, price: 1500 }
];

export const mockAttendance: Attendance[] = [
  // Today's classes check-ins (simulated date 2026-07-16)
  { id: "att-1", studentId: "AYUR-2026-001", studentName: "Nimasha Fernando", classId: "c-1", className: "Morning Hatha Flow", date: "2026-07-16", status: "Present", checkInTime: "06:25", method: "QR Code" },
  { id: "att-2", studentId: "AYUR-2026-003", studentName: "Kasun Jayasundara", classId: "c-1", className: "Morning Hatha Flow", date: "2026-07-16", status: "Late", checkInTime: "06:38", method: "PIN" },
  { id: "att-3", studentId: "AYUR-2026-004", studentName: "Pooja de Alwis", classId: "c-1", className: "Morning Hatha Flow", date: "2026-07-16", status: "Present", checkInTime: "06:18", method: "QR Code" },
  { id: "att-4", studentId: "AYUR-2026-002", studentName: "Aruni Rajapaksha", classId: "c-5", className: "Prenatal Gentle Yoga", date: "2026-07-16", status: "Present", checkInTime: "09:55", method: "Manual" },
  
  // Previous check-ins
  { id: "att-5", studentId: "AYUR-2026-001", studentName: "Nimasha Fernando", classId: "c-2", className: "Spine & Back Care Yoga", date: "2026-07-15", status: "Present", checkInTime: "17:22", method: "Search" },
  { id: "att-6", studentId: "AYUR-2026-003", studentName: "Kasun Jayasundara", classId: "c-3", className: "Pranayama & Meditation", date: "2026-07-14", status: "Absent", checkInTime: "", method: "Manual" },
  { id: "att-7", studentId: "AYUR-2026-004", studentName: "Pooja de Alwis", classId: "c-4", className: "Ashtanga Primary Series", date: "2026-07-15", status: "Present", checkInTime: "06:20", method: "QR Code" },
  { id: "att-8", studentId: "AYUR-2026-001", studentName: "Nimasha Fernando", classId: "c-1", className: "Morning Hatha Flow", date: "2026-07-13", status: "Present", checkInTime: "06:28", method: "PIN" },
  { id: "att-9", studentId: "AYUR-2026-004", studentName: "Pooja de Alwis", classId: "c-1", className: "Morning Hatha Flow", date: "2026-07-13", status: "Present", checkInTime: "06:15", method: "QR Code" },
  { id: "att-10", studentId: "AYUR-2026-002", studentName: "Aruni Rajapaksha", classId: "c-7", className: "Weekend Sunset Yoga", date: "2026-07-11", status: "Present", checkInTime: "16:21", method: "Search" }
];

export const mockPayments: Payment[] = [
  { id: "p-1", studentId: "AYUR-2026-001", studentName: "Nimasha Fernando", amount: 3500, date: "2026-07-01", method: "Card", status: "Paid", membershipType: "Monthly Pass", outstandingBalance: 0, lateFee: 0, invoiceNo: "INV-2026-1049" },
  { id: "p-2", studentId: "AYUR-2026-002", studentName: "Aruni Rajapaksha", amount: 3500, date: "2026-06-15", method: "Bank Transfer", status: "Paid", membershipType: "Monthly Pass", outstandingBalance: 0, lateFee: 0, invoiceNo: "INV-2026-1011" },
  { id: "p-3", studentId: "AYUR-2026-003", studentName: "Kasun Jayasundara", amount: 4000, date: "2026-06-01", method: "Cash", status: "Paid", membershipType: "Private Session", outstandingBalance: 0, lateFee: 0, invoiceNo: "INV-2026-0988" },
  { id: "p-4", studentId: "AYUR-2026-004", studentName: "Pooja de Alwis", amount: 3500, date: "2026-01-01", method: "Bank Transfer", status: "Paid", membershipType: "Monthly Pass", outstandingBalance: 0, lateFee: 0, invoiceNo: "INV-2026-0512" },
  { id: "p-5", studentId: "AYUR-2026-002", studentName: "Aruni Rajapaksha", amount: 3500, date: "2026-07-16", method: "Online Payment", status: "Pending", membershipType: "Monthly Pass", outstandingBalance: 3500, lateFee: 0, invoiceNo: "INV-2026-1114" }
];

export const mockInquiries: Inquiry[] = [
  { id: "inq-1", name: "Suresh Perera", phone: "+94 77 987 6543", source: "Facebook", status: "Trial", date: "2026-07-10", notes: "Inquired about beginner schedules. Scheduled for a free trial on Saturday.", followUpDate: "2026-07-17" },
  { id: "inq-2", name: "Malkanthi Silva", phone: "+94 71 555 4321", source: "Walk-in", status: "Interested", date: "2026-07-12", notes: "Living nearby. Visited studio. Wants prenatal packages for her daughter.", followUpDate: "2026-07-15" },
  { id: "inq-3", name: "Danuka Wijesinghe", phone: "+94 72 343 5566", source: "Google", status: "Joined", date: "2026-07-05", notes: "Searching for back pain relief classes. Found Spine Care class.", followUpDate: "2026-07-06" },
  { id: "inq-4", name: "Anura de Mel", phone: "+94 76 800 2211", source: "Website", status: "Rejected", date: "2026-06-20", notes: "Corporate inquiries. Pricing was out of budget limit.", followUpDate: "2026-06-25" }
];

export const mockTrials: TrialClass[] = [
  { id: "t-1", studentName: "Suresh Perera", phone: "+94 77 987 6543", type: "Free Trial", classId: "c-7", className: "Weekend Sunset Yoga", date: "2026-07-11", attendanceStatus: "Attended", feedback: "Loved the tranquil vibes of the sunset session. Intends to register for Monthly Pass.", converted: true },
  { id: "t-2", studentName: "Heshani Jayasinghe", phone: "+94 71 333 4444", type: "Paid Trial", classId: "c-1", className: "Morning Hatha Flow", date: "2026-07-14", attendanceStatus: "Absent", feedback: "Did not wake up on time.", converted: false }
];

export const mockExpenses: Expense[] = [
  { id: "e-1", category: "Rent", description: "Studio space lease monthly payment", amount: 65000, date: "2026-07-05" },
  { id: "e-2", category: "Utilities", description: "Electricity & water bill Colombo 07", amount: 18400, date: "2026-07-08" },
  { id: "e-3", category: "Salaries", description: "Instructor Dilani Silva payment July part 1", amount: 35000, date: "2026-07-15" },
  { id: "e-4", category: "Marketing", description: "Facebook and Instagram flyer boosts", amount: 8000, date: "2026-07-11" },
  { id: "e-5", category: "Supplies", description: "New yoga bolster covers and essential oils", amount: 12500, date: "2026-07-12" }
];

export const mockAuditLogs: AuditLog[] = [
  { id: "log-1", timestamp: "2026-07-16T08:30:00Z", userId: "u-3", username: "chamani", role: "Receptionist", action: "Mark Attendance", details: "Checked-in Nimasha Fernando for c-1 via QR" },
  { id: "log-2", timestamp: "2026-07-16T08:32:00Z", userId: "u-3", username: "chamani", role: "Receptionist", action: "Mark Attendance", details: "Checked-in Kasun Jayasundara for c-1 via PIN" },
  { id: "log-3", timestamp: "2026-07-16T10:15:00Z", userId: "u-1", username: "kumodya", role: "Admin", action: "Student Update", details: "Modified medical recommendations for Nimasha Fernando" },
  { id: "log-4", timestamp: "2026-07-16T11:00:00Z", userId: "u-3", username: "chamani", role: "Receptionist", action: "Create Payment", details: "Recorded pending online renewal for Aruni Rajapaksha" },
  { id: "log-5", timestamp: "2026-07-15T18:00:00Z", userId: "u-1", username: "kumodya", role: "Admin", action: "Settings Changes", details: "Updated studio holiday calendar policies" }
];

export const mockProgress: StudentProgressEntry[] = [
  {
    id: "pr-1",
    studentId: "AYUR-2026-001",
    date: "2026-07-15",
    weight: 62.0,
    bmi: 22.8,
    flexibilityScore: 5,
    breathingScore: 6,
    balanceScore: 5,
    meditationMinutes: 15,
    attendanceTrend: 8,
    goalAchievement: "40%",
    instructorNotes: "Nimasha is reporting significantly less stiffness in the morning. Lumbar flexibility improved by 2cm in seated forward bend."
  },
  {
    id: "pr-2",
    studentId: "AYUR-2026-001",
    date: "2026-06-15",
    weight: 63.2,
    bmi: 23.2,
    flexibilityScore: 3,
    breathingScore: 5,
    balanceScore: 4,
    meditationMinutes: 10,
    attendanceTrend: 6,
    goalAchievement: "20%",
    instructorNotes: "Initial assessment and setup. Nimasha's back pain makes standard Sphinx pose uncomfortable. Initiated supported puppy pose stretches."
  },
  {
    id: "pr-3",
    studentId: "AYUR-2026-003",
    date: "2026-07-01",
    weight: 89.0,
    bmi: 29.4,
    flexibilityScore: 3,
    breathingScore: 4,
    balanceScore: 4,
    meditationMinutes: 10,
    attendanceTrend: 5,
    goalAchievement: "30%",
    instructorNotes: "Kasun is showing good breath retention controls. Heart rate spikes are lower. Knee loading remains limited to 90 degrees."
  }
];

export const mockQuotes = [
  "Yoga is not about touching your toes, it is about what you learn on the way down.",
  "In the midst of movement and chaos, keep stillness inside of you. - Deepak Chopra",
  "The breath is the king of mind. - B.K.S. Iyengar",
  "Yoga takes you into the present moment, the only place where life exists.",
  "Quiet the mind, and the soul will speak."
];
