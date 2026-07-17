import mongoose from "mongoose";
import { 
  mockStudents, 
  mockPayments, 
  mockAttendance, 
  mockClasses, 
  mockInquiries, 
  mockTrials, 
  mockExpenses, 
  mockAuditLogs, 
  mockSettings 
} from "../mockData.js";

// Schemas
const StudentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  qrCodeUrl: String,
  photoUrl: String,
  fullName: { type: String, required: true },
  gender: String,
  dateOfBirth: String,
  age: Number,
  nicOrPassport: String,
  occupation: String,
  address: String,
  city: String,
  district: String,
  phone: String,
  whatsApp: String,
  email: String,
  emergencyContactName: String,
  emergencyContactPhone: String,
  emergencyContactRelation: String,
  classId: String,
  className: String,
  medicalConditions: mongoose.Schema.Types.Mixed,
  yogaExperience: String,
  goals: String,
  assessment: mongoose.Schema.Types.Mixed,
  measurements: mongoose.Schema.Types.Mixed,
  status: { type: String, default: "Active" },
  registrationDate: String,
  membershipType: String,
  notes: String,
  privateNotes: String,
  documents: [mongoose.Schema.Types.Mixed]
});

const PaymentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  studentId: String,
  studentName: String,
  amount: Number,
  date: String,
  method: String,
  status: String,
  membershipType: String,
  discountCode: String,
  discountAmount: Number,
  installmentNo: Number,
  totalInstallments: Number,
  outstandingBalance: { type: Number, default: 0 },
  lateFee: { type: Number, default: 0 },
  invoiceNo: String
});

const AttendanceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  studentId: String,
  studentName: String,
  classId: String,
  className: String,
  date: String,
  status: String,
  checkInTime: String,
  method: String,
  instructorNotes: String
});

const ClassScheduleSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  instructorId: String,
  instructorName: String,
  dayOfWeek: String,
  startTime: String,
  endTime: String,
  type: String,
  capacity: Number,
  enrolledCount: Number,
  waitingListCount: Number,
  isRecurring: Boolean,
  city: String
});

const InquirySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  phone: String,
  source: String,
  status: String,
  date: String,
  notes: String,
  followUpDate: String
});

const TrialClassSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  studentName: String,
  phone: String,
  type: String,
  classId: String,
  className: String,
  date: String,
  attendanceStatus: String,
  feedback: String,
  converted: Boolean
});

const ExpenseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  category: String,
  description: String,
  amount: Number,
  date: String
});

const AuditLogSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  timestamp: String,
  userId: String,
  username: String,
  role: String,
  action: String,
  details: String
});

const BusinessSettingsSchema = new mongoose.Schema({
  businessName: String,
  logoUrl: String,
  address: String,
  phone: String,
  email: String,
  whatsAppNum: String,
  socials: mongoose.Schema.Types.Mixed,
  businessHours: String,
  taxPercentage: Number,
  currency: String,
  timeZone: String,
  language: String
}, { minimize: false });

// Models
export const StudentModel = mongoose.model("Student", StudentSchema);
export const PaymentModel = mongoose.model("Payment", PaymentSchema);
export const AttendanceModel = mongoose.model("Attendance", AttendanceSchema);
export const ClassScheduleModel = mongoose.model("ClassSchedule", ClassScheduleSchema);
export const InquiryModel = mongoose.model("Inquiry", InquirySchema);
export const TrialClassModel = mongoose.model("TrialClass", TrialClassSchema);
export const ExpenseModel = mongoose.model("Expense", ExpenseSchema);
export const AuditLogModel = mongoose.model("AuditLog", AuditLogSchema);
export const BusinessSettingsModel = mongoose.model("BusinessSettings", BusinessSettingsSchema);

export async function initDB() {
  let uri = (process.env.MONGODB_URI || "").trim();
  
  // Strip any wrapping quotes
  if ((uri.startsWith('"') && uri.endsWith('"')) || (uri.startsWith("'") && uri.endsWith("'"))) {
    uri = uri.slice(1, -1).trim();
  }

  // Fallback if empty or invalid format
  if (!uri || (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://"))) {
    uri = "mongodb+srv://ayurva:ayurva123@cluster0.ezwo0uo.mongodb.net/?appName=Cluster0";
  }

  console.log(`[MongoDB] Connecting to ${uri.substring(0, 40)}...`);
  
  await mongoose.connect(uri);
  console.log("[MongoDB] Connection successful!");

  // Seed data if empty
  const studentCount = await StudentModel.countDocuments();
  if (studentCount === 0) {
    console.log("[MongoDB] Seeding mock data...");
    await StudentModel.insertMany(mockStudents);
    await PaymentModel.insertMany(mockPayments);
    await AttendanceModel.insertMany(mockAttendance);
    await ClassScheduleModel.insertMany(mockClasses);
    await InquiryModel.insertMany(mockInquiries);
    await TrialClassModel.insertMany(mockTrials);
    await ExpenseModel.insertMany(mockExpenses);
    await AuditLogModel.insertMany(mockAuditLogs);
    await BusinessSettingsModel.create(mockSettings);
    console.log("[MongoDB] Database seeding complete!");
  } else {
    console.log("[MongoDB] Database already seeded.");
  }
}
