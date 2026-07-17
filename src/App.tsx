import React, { useState, useEffect } from "react";
import { 
  Home, Users, CheckSquare, DollarSign, BarChart2, 
  Settings, LogOut, Shield, Globe, Menu, X, Award, Calendar
} from "lucide-react";

// Components
import Dashboard from "./components/Dashboard";
import StudentManagement from "./components/StudentManagement";
import AttendanceSystem from "./components/AttendanceSystem";
import BillingScheduler from "./components/BillingScheduler";
import YogaClasses from "./components/YogaClasses";
import InquiriesReports from "./components/InquiriesReports";
import SettingsAudit from "./components/SettingsAudit";

// Mock Seed Data
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
} from "./mockData";

// Types
import { 
  Student, Payment, Attendance, ClassSchedule, 
  Inquiry, TrialClass, Expense, AuditLog, BusinessSettings 
} from "./types";

// Translation dictionaries for bilingual support (English / Sinhala)
const TRANSLATIONS = {
  English: {
    dashboard: "Dashboard",
    students: "Students",
    attendance: "Attendance",
    classes: "Yoga Classes",
    billing: "Billing",
    leads: "Leads & Reports",
    settings: "Settings & Audits",
    role: "User Role",
    admin: "Admin (Kumodya)",
    instructor: "Yoga Instructor",
    receptionist: "Receptionist",
    activeStudents: "Active Students",
    todaysAttendance: "Today's Attendance",
    monthlyRevenue: "Monthly Revenue",
    conversionRate: "Leads Conversion",
    yogaexperience: "Yoga Experience",
    wellnessInspiredHeading: "Ayurva Yoga & Wellness Student Hub",
    welcomeBack: "Namaste, welcome back to the shala.",
    allRightsReserved: "© 2026 Ayurva Yoga & Wellness by Kumodya Dilshani. All rights reserved."
  },
  Sinhala: {
    dashboard: "ප්‍රධාන පුවරුව",
    students: "ශිෂ්‍ය කළමනාකරණය",
    attendance: "පැමිණීම සලකුණු කිරීම",
    classes: "යෝගා පන්ති",
    billing: "ගෙවීම්",
    leads: "ප්‍රතිපල සහ වාර්තා",
    settings: "සැකසුම් සහ විගණන",
    role: "පරිශීලක භූමිකාව",
    admin: "ප්‍රධාන පරිපාලක (කුමෝද්‍යා)",
    instructor: "යෝගා උපදේශක",
    receptionist: "පිළිගැනීමේ නිලධාරී",
    activeStudents: "ක්‍රියාකාරී සිසුන්",
    todaysAttendance: "අද පැමිණීම",
    monthlyRevenue: "මාසික ආදායම",
    conversionRate: "පරිවර්තන අනුපාතය",
    yogaexperience: "යෝගා පළපුරුද්ද",
    wellnessInspiredHeading: "ආයුර්වා යෝග සහ සුවතා පියස",
    welcomeBack: "නමස්තේ, නැවත පැමිණීම සාදරයෙන් පිළිගනිමු.",
    allRightsReserved: "© 2026 ආයුර්වා යෝග සහ සුවතා මධ්‍යස්ථානය. සියලුම හිමිකම් ඇවිරිණි."
  }
};

export default function App() {
  // Master Database States (initialized with mock data as local fallback)
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [attendance, setAttendance] = useState<Attendance[]>(mockAttendance);
  const [classes, setClasses] = useState<ClassSchedule[]>(mockClasses);
  const [inquiries, setInquiries] = useState<Inquiry[]>(mockInquiries);
  const [trials, setTrials] = useState<TrialClass[]>(mockTrials);
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>(mockSettings);
  const [loadingDb, setLoadingDb] = useState(true);

  // Fetch all states from MongoDB on startup
  useEffect(() => {
    const fetchMongoData = async () => {
      try {
        const [
          studentsRes,
          paymentsRes,
          attendanceRes,
          classesRes,
          inquiriesRes,
          trialsRes,
          expensesRes,
          auditLogsRes,
          settingsRes
        ] = await Promise.all([
          fetch("/api/students").then(r => r.ok ? r.json() : null),
          fetch("/api/payments").then(r => r.ok ? r.json() : null),
          fetch("/api/attendance").then(r => r.ok ? r.json() : null),
          fetch("/api/classes").then(r => r.ok ? r.json() : null),
          fetch("/api/inquiries").then(r => r.ok ? r.json() : null),
          fetch("/api/trials").then(r => r.ok ? r.json() : null),
          fetch("/api/expenses").then(r => r.ok ? r.json() : null),
          fetch("/api/auditLogs").then(r => r.ok ? r.json() : null),
          fetch("/api/businessSettings").then(r => r.ok ? r.json() : null)
        ]);

        if (Array.isArray(studentsRes)) setStudents(studentsRes);
        if (Array.isArray(paymentsRes)) setPayments(paymentsRes);
        if (Array.isArray(attendanceRes)) setAttendance(attendanceRes);
        if (Array.isArray(classesRes)) setClasses(classesRes);
        if (Array.isArray(inquiriesRes)) setInquiries(inquiriesRes);
        if (Array.isArray(trialsRes)) setTrials(trialsRes);
        if (Array.isArray(expensesRes)) setExpenses(expensesRes);
        if (Array.isArray(auditLogsRes)) setAuditLogs(auditLogsRes);
        if (settingsRes && settingsRes.businessName) setBusinessSettings(settingsRes);
      } catch (err) {
        console.error("[MongoDB] Failed to fetch master database state from server:", err);
      } finally {
        setLoadingDb(false);
      }
    };
    fetchMongoData();
  }, []);

  // General App States
  const [currentTab, setCurrentTab] = useState<"Dashboard" | "Students" | "Attendance" | "Classes" | "Billing" | "Leads" | "Settings">("Dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [language, setLanguage] = useState<"English" | "Sinhala">("English");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userRole = "Admin";
  const t = TRANSLATIONS[language];

  // Audit Logger Helper
  const addAuditLog = async (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: "u-1",
      username: "Kumodya Dilshani",
      role: "Admin",
      action,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);

    try {
      await fetch("/api/auditLogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLog)
      });
    } catch (err) {
      console.error("[MongoDB] Failed to persist audit log:", err);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUsername.trim().toLowerCase() === "admin" && loginPassword === "password") {
      setIsLoggedIn(true);
      setLoginError("");
      addAuditLog("User Login", "Admin logged in successfully via standard credentials.");
    } else if (loginUsername.trim().toLowerCase() === "kumodya" && loginPassword === "ayurva2026") {
      setIsLoggedIn(true);
      setLoginError("");
      addAuditLog("User Login", "Kumodya logged in successfully via personal owner key.");
    } else {
      setLoginError("Invalid credentials. Please use 'admin' and 'password'.");
    }
  };

  const handleQuickDemoLogin = () => {
    setLoginUsername("admin");
    setLoginPassword("password");
    setIsLoggedIn(true);
    setLoginError("");
    addAuditLog("Demo Login", "System accessed via quick login shortcut.");
  };

  // State Modifiers
  const handleAddStudent = async (student: Student) => {
    setStudents(prev => [student, ...prev]);
    addAuditLog("Register Student", `Successfully enrolled new student: ${student.fullName} (ID: ${student.id})`);
    try {
      await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student)
      });
    } catch (err) {
      console.error("[MongoDB] Failed to persist new student:", err);
    }
  };

  const handleUpdateStudent = async (student: Student) => {
    setStudents(prev => prev.map(s => s.id === student.id ? student : s));
    addAuditLog("Update Student Profile", `Modified data schema for student: ${student.fullName}`);
    try {
      await fetch(`/api/students/${student.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student)
      });
    } catch (err) {
      console.error("[MongoDB] Failed to update student:", err);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    const student = students.find(s => s.id === id);
    setStudents(prev => prev.filter(s => s.id !== id));
    addAuditLog("Delete Student", `Removed student record from system: ${student?.fullName} (ID: ${id})`);
    try {
      await fetch(`/api/students/${id}`, {
        method: "DELETE"
      });
    } catch (err) {
      console.error("[MongoDB] Failed to delete student:", err);
    }
  };

  const handleMarkAttendance = async (att: Attendance) => {
    setAttendance(prev => [att, ...prev]);
    addAuditLog("Check-In Student", `Recorded ${att.status} check-in for ${att.studentName} via ${att.method}`);
    try {
      await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(att)
      });
    } catch (err) {
      console.error("[MongoDB] Failed to persist attendance:", err);
    }
  };

  const handleUpdateAttendance = async (id: string, status: "Present" | "Absent" | "Late" | "Excused") => {
    setAttendance(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    const record = attendance.find(a => a.id === id);
    addAuditLog("Update Attendance", `Changed roster check status to ${status} for ${record?.studentName}`);
    if (record) {
      try {
        await fetch(`/api/attendance/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...record, status })
        });
      } catch (err) {
        console.error("[MongoDB] Failed to update attendance:", err);
      }
    }
  };

  const handleAddPayment = async (payment: Payment) => {
    setPayments(prev => [payment, ...prev]);
    addAuditLog("Record Revenue Payment", `Collected LKR ${payment.amount} fee for ${payment.membershipType} package (Invoice: ${payment.invoiceNo})`);
    try {
      await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payment)
      });
    } catch (err) {
      console.error("[MongoDB] Failed to persist payment:", err);
    }
  };

  const handleAddClass = async (classSched: ClassSchedule) => {
    setClasses(prev => [...prev, classSched]);
    addAuditLog("Schedule Class Session", `Added weekly ${classSched.name} on ${classSched.dayOfWeek}s at ${classSched.startTime}`);
    try {
      await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(classSched)
      });
    } catch (err) {
      console.error("[MongoDB] Failed to persist class schedule:", err);
    }
  };

  const handleDeleteClass = async (id: string) => {
    const classSched = classes.find(c => c.id === id);
    setClasses(prev => prev.filter(c => c.id !== id));
    addAuditLog("Delete Class Session", `Removed class session: ${classSched?.name}`);
    try {
      await fetch(`/api/classes/${id}`, {
        method: "DELETE"
      });
    } catch (err) {
      console.error("[MongoDB] Failed to delete class schedule:", err);
    }
  };

  const handleAddInquiry = async (inq: Inquiry) => {
    setInquiries(prev => [inq, ...prev]);
    addAuditLog("Log Social Query Inquiry", `Created prospective student inquiry lead for ${inq.name} from ${inq.source}`);
    try {
      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inq)
      });
    } catch (err) {
      console.error("[MongoDB] Failed to persist inquiry lead:", err);
    }
  };

  const handleUpdateInquiryStatus = async (id: string, status: "Interested" | "Trial" | "Joined" | "Rejected") => {
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    const inquiry = inquiries.find(i => i.id === id);
    addAuditLog("Update Lead Status", `Changed inquiry lead conversion flag of ${inquiry?.name} to ${status}`);
    if (inquiry) {
      try {
        await fetch(`/api/inquiries/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...inquiry, status })
        });
      } catch (err) {
        console.error("[MongoDB] Failed to update inquiry status:", err);
      }
    }
  };

  const handleUpdateSettings = async (settings: BusinessSettings) => {
    setBusinessSettings(settings);
    addAuditLog("Update Studio Parameters", "Saved studio profiles and default notification rules.");
    try {
      await fetch("/api/businessSettings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
    } catch (err) {
      console.error("[MongoDB] Failed to persist business settings:", err);
    }
  };

  const handleClearLogs = async () => {
    setAuditLogs([]);
    try {
      await fetch("/api/auditLogs", {
        method: "DELETE"
      });
    } catch (err) {
      console.error("[MongoDB] Failed to clear audit logs from server:", err);
    }
  };

  // State Restoration
  const handleRestoreBackup = (newState: any) => {
    if (newState.students) setStudents(newState.students);
    if (newState.payments) setPayments(newState.payments);
    if (newState.attendance) setAttendance(newState.attendance);
    if (newState.classes) setClasses(newState.classes);
    if (newState.inquiries) setInquiries(newState.inquiries);
    if (newState.expenses) setExpenses(newState.expenses);
    addAuditLog("Restore Database State", "System DB was restored using local JSON backup.");
  };

  const getCompleteState = () => ({
    students,
    payments,
    attendance,
    classes,
    inquiries,
    expenses
  });

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg dark:bg-brand-dark-bg px-4 py-12 font-sans">
        <div className="w-full max-w-md bg-white dark:bg-brand-dark-card rounded-3xl shadow-xl border border-stone-100 dark:border-stone-800/80 p-8 space-y-6 relative overflow-hidden transition-all duration-300">
          
          {/* Accent Gold top border */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-secondary" />

          {/* Logo & Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center bg-stone-100 dark:bg-brand-dark-bg p-3.5 rounded-2xl text-brand-secondary border border-stone-200 dark:border-stone-800 shadow-sm mx-auto">
              <Award className="w-7 h-7 text-brand-accent animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-wider text-brand-primary">AYURVA YOGA & WELLNESS</h2>
              <p className="text-xs text-stone-500 font-semibold uppercase tracking-widest mt-0.5">by Kumodya Dilshani</p>
              <span className="inline-block text-[10px] bg-brand-primary/10 text-brand-primary font-bold px-2.5 py-0.5 rounded-full mt-2">
                Student Hub & Manager Portal
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {loginError && (
              <div className="bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 p-3 rounded-xl border border-rose-100 dark:border-rose-900/40 text-xs flex items-center gap-2 font-semibold">
                <span className="font-bold">Error:</span> {loginError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                Username / Email
              </label>
              <input
                type="text"
                required
                placeholder="e.g. admin"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="w-full text-xs bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3.5 py-3 focus:outline-none focus:ring-1 focus:ring-brand-primary text-stone-800 dark:text-white font-medium transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full text-xs bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3.5 py-3 focus:outline-none focus:ring-1 focus:ring-brand-primary text-stone-800 dark:text-white font-medium transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full text-xs font-bold bg-brand-primary hover:bg-brand-primary/95 text-white py-3.5 rounded-xl cursor-pointer shadow transition-all flex items-center justify-center gap-2 animate-fadeIn"
            >
              Access System Control
            </button>
          </form>

          {/* Helper Credentials Box */}
          <div className="bg-brand-bg/50 dark:bg-brand-dark-bg/30 border border-stone-100 dark:border-stone-800 rounded-2xl p-4 text-[11px] space-y-2">
            <div className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-brand-accent rounded-full" />
              Demo Credentials Info
            </div>
            <div className="text-stone-500 dark:text-stone-400 font-medium space-y-1 leading-relaxed">
              <p>To view the full management dashboard, use either option:</p>
              <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[10px]">
                <div className="bg-white dark:bg-brand-dark-card p-1.5 rounded border border-stone-200/50 dark:border-stone-800 text-stone-700 dark:text-stone-300">
                  <span className="font-bold block text-stone-500 dark:text-stone-400">Username:</span> admin
                  <span className="font-bold block text-stone-500 dark:text-stone-400 mt-0.5">Password:</span> password
                </div>
                <div className="bg-white dark:bg-brand-dark-card p-1.5 rounded border border-stone-200/50 dark:border-stone-800 text-stone-700 dark:text-stone-300">
                  <span className="font-bold block text-stone-500 dark:text-stone-400">Username:</span> kumodya
                  <span className="font-bold block text-stone-500 dark:text-stone-400 mt-0.5">Password:</span> ayurva2026
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full text-[10px] font-bold bg-white dark:bg-brand-dark-card text-brand-secondary border border-stone-200 dark:border-stone-800 hover:border-brand-secondary/40 py-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1"
            >
              ✨ One-Click Auto-Fill & Login
            </button>
          </div>

          <div className="text-center text-[10px] text-stone-400 dark:text-stone-500 font-semibold">
            Ayurva Yoga & Wellness Shala Center • Secure Session
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg dark:bg-brand-dark-bg text-stone-800 dark:text-stone-100 font-sans flex flex-col md:flex-row">
      
      {/* Sidebar navigation */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-brand-dark-card border-r border-stone-100 dark:border-stone-800 flex flex-col transform md:translate-x-0 transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        
        {/* Logo and studio title */}
        <div className="p-5 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center bg-brand-bg/40 dark:bg-brand-dark-bg/40">
          <div className="flex items-center gap-2">
            <div className="bg-stone-100 p-2 rounded-xl text-brand-secondary shadow-xs border border-stone-200">
              <Award className="w-5 h-5 text-brand-accent" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-wider text-brand-secondary">AYURVA YOGA</h1>
              <span className="text-[9px] text-stone-500 font-bold uppercase tracking-widest">by Kumodya Dilshani</span>
            </div>
          </div>
          
          <button 
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1.5 hover:bg-stone-100 dark:hover:bg-brand-dark-bg rounded-lg"
          >
            <X className="w-4 h-4 text-stone-500" />
          </button>
        </div>

        {/* Tab Links */}
        <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
          <button
            onClick={() => { setCurrentTab("Dashboard"); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${
              currentTab === "Dashboard" 
                ? "bg-stone-100 text-brand-secondary shadow-xs font-black border-l-4 border-brand-accent rounded-l-none pl-3" 
                : "text-stone-500 hover:bg-stone-100/50 hover:text-brand-secondary"
            }`}
          >
            <Home className="w-4 h-4" />
            <span>{t.dashboard}</span>
          </button>

          <button
            onClick={() => { setCurrentTab("Students"); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${
              currentTab === "Students" 
                ? "bg-stone-100 text-brand-secondary shadow-xs font-black border-l-4 border-brand-accent rounded-l-none pl-3" 
                : "text-stone-500 hover:bg-stone-100/50 hover:text-brand-secondary"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{t.students}</span>
          </button>

          <button
            onClick={() => { setCurrentTab("Attendance"); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${
              currentTab === "Attendance" 
                ? "bg-stone-100 text-brand-secondary shadow-xs font-black border-l-4 border-brand-accent rounded-l-none pl-3" 
                : "text-stone-500 hover:bg-stone-100/50 hover:text-brand-secondary"
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>{t.attendance}</span>
          </button>

          <button
            onClick={() => { setCurrentTab("Classes"); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${
              currentTab === "Classes" 
                ? "bg-stone-100 text-brand-secondary shadow-xs font-black border-l-4 border-brand-accent rounded-l-none pl-3" 
                : "text-stone-500 hover:bg-stone-100/50 hover:text-brand-secondary"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>{t.classes}</span>
          </button>

          <button
            onClick={() => { setCurrentTab("Billing"); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${
              currentTab === "Billing" 
                ? "bg-stone-100 text-brand-secondary shadow-xs font-black border-l-4 border-brand-accent rounded-l-none pl-3" 
                : "text-stone-500 hover:bg-stone-100/50 hover:text-brand-secondary"
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>{t.billing}</span>
          </button>

          <button
            onClick={() => { setCurrentTab("Leads"); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${
              currentTab === "Leads" 
                ? "bg-stone-100 text-brand-secondary shadow-xs font-black border-l-4 border-brand-accent rounded-l-none pl-3" 
                : "text-stone-500 hover:bg-stone-100/50 hover:text-brand-secondary"
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>{t.leads}</span>
          </button>

          <button
            onClick={() => { setCurrentTab("Settings"); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${
              currentTab === "Settings" 
                ? "bg-stone-100 text-brand-secondary shadow-xs font-black border-l-4 border-brand-accent rounded-l-none pl-3" 
                : "text-stone-500 hover:bg-stone-100/50 hover:text-brand-secondary"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>{t.settings}</span>
          </button>
        </nav>

        {/* Logged-in User Info & Logout Button */}
        <div className="p-4 border-t border-stone-100 dark:border-stone-800 bg-brand-bg/30 dark:bg-brand-dark-bg/30 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-brand-secondary/10 flex items-center justify-center text-brand-secondary font-bold text-xs border border-brand-secondary/20">
              KD
            </div>
            <div>
              <div className="font-bold text-[11px] text-stone-900 dark:text-white">Kumodya Dilshani</div>
              <div className="text-[9px] text-stone-400 font-semibold uppercase tracking-wider">Studio Administrator</div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-1 border-t border-stone-100/60 dark:border-stone-800/60">
            {/* Language toggle option */}
            <button
              onClick={() => {
                const updated = language === "English" ? "Sinhala" : "English";
                setLanguage(updated);
                addAuditLog("Toggle Language", `Language switched to ${updated}`);
              }}
              className="text-[10px] text-stone-400 hover:text-brand-secondary font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              {language === "English" ? "සිංහල" : "English"}
            </button>

            <button
              onClick={() => {
                setIsLoggedIn(false);
                setLoginUsername("");
                setLoginPassword("");
                setLoginError("");
                addAuditLog("User Logout", "Admin logged out successfully.");
              }}
              className="text-[10px] text-rose-500 hover:text-rose-600 font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>

      </aside>

      {/* Main viewport frame */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        
        {/* Mobile Header */}
        <header className="bg-white dark:bg-brand-dark-card border-b border-stone-100 dark:border-stone-800 p-4 sticky top-0 z-30 flex items-center justify-between md:hidden shadow-xs">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 hover:bg-stone-50 dark:hover:bg-brand-dark-bg rounded-lg"
            >
              <Menu className="w-5 h-5 text-stone-700" />
            </button>
            <div className="bg-brand-secondary p-1.5 rounded-lg text-white">
              <Award className="w-4 h-4 text-brand-accent" />
            </div>
            <h1 className="text-xs font-black text-stone-900 dark:text-white tracking-wide">AYURVA YOGA</h1>
          </div>

          <div className="text-[10px] font-bold px-2 py-1 bg-brand-secondary/10 text-brand-secondary rounded-full uppercase">
            {userRole}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6 md:p-8 space-y-6 flex-1 max-w-7xl w-full mx-auto">
          
          {/* Welcome Banner */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-white dark:bg-brand-dark-card p-5 rounded-2xl shadow-xs border border-stone-100 dark:border-stone-800">
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-white leading-tight">
                {t.wellnessInspiredHeading}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">{t.welcomeBack}</p>
            </div>
            <div className="text-[10px] bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 font-bold px-2.5 py-1 rounded-full uppercase shrink-0">
              ● Active July 2026 Season
            </div>
          </div>

          {/* Active Router tab rendering */}
          {currentTab === "Dashboard" && (
            <Dashboard
              students={students}
              payments={payments}
              attendance={attendance}
              classes={classes}
              settings={businessSettings}
              role={userRole}
              lang={language}
              t={t}
              onNavigate={(tab) => setCurrentTab(tab as any)}
              onQuickCheckIn={(studentId) => {
                const student = students.find(s => s.id === studentId);
                if (!student) return;
                const activeClass = classes[0];
                const newAtt: Attendance = {
                  id: `att-${Date.now()}`,
                  studentId: student.id,
                  studentName: student.fullName,
                  classId: activeClass?.id || "c-1",
                  className: activeClass?.name || "Yoga Session",
                  date: "2026-07-16",
                  status: "Present",
                  checkInTime: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
                  method: "Search"
                };
                handleMarkAttendance(newAtt);
                alert(`Namaste! Quick Present Check-In recorded for ${student.fullName}.`);
              }}
              onQuickPayment={(studentId, amount) => {
                const student = students.find(s => s.id === studentId);
                if (!student) return;
                const newPayment: Payment = {
                  id: `p-${Date.now()}`,
                  studentId: student.id,
                  studentName: student.fullName,
                  amount,
                  date: "2026-07-16",
                  method: "Cash",
                  status: "Paid",
                  membershipType: "Drop-in Pass",
                  outstandingBalance: 0,
                  lateFee: 0,
                  invoiceNo: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`
                };
                handleAddPayment(newPayment);
                alert(`Quick LKR ${amount} payment recorded for ${student.fullName}. Invoice printed.`);
              }}
            />
          )}

          {currentTab === "Students" && (
            <StudentManagement
              students={students}
              classes={classes}
              onAddStudent={handleAddStudent}
              onUpdateStudent={handleUpdateStudent}
              onDeleteStudent={handleDeleteStudent}
              role={userRole}
              t={t}
            />
          )}

          {currentTab === "Attendance" && (
            <AttendanceSystem
              students={students}
              attendance={attendance}
              classes={classes}
              onMarkAttendance={handleMarkAttendance}
              onUpdateAttendance={handleUpdateAttendance}
              role={userRole}
            />
          )}

          {currentTab === "Classes" && (
            <YogaClasses
              classes={classes}
              onAddClass={handleAddClass}
              onDeleteClass={handleDeleteClass}
              role={userRole}
            />
          )}

          {currentTab === "Billing" && (
            <BillingScheduler
              students={students}
              payments={payments}
              memberships={[]}
              onAddPayment={handleAddPayment}
              role={userRole}
            />
          )}

          {currentTab === "Leads" && (
            <InquiriesReports
              students={students}
              payments={payments}
              attendance={attendance}
              inquiries={inquiries}
              trials={trials}
              expenses={expenses}
              onAddInquiry={handleAddInquiry}
              onUpdateInquiryStatus={handleUpdateInquiryStatus}
              role={userRole}
            />
          )}

          {currentTab === "Settings" && (
            <SettingsAudit
              settings={businessSettings}
              auditLogs={auditLogs}
              onUpdateSettings={handleUpdateSettings}
              onRestoreBackup={handleRestoreBackup}
              onClearLogs={handleClearLogs}
              role={userRole}
              lang={language}
              onLanguageToggle={() => {
                const updated = language === "English" ? "Sinhala" : "English";
                setLanguage(updated);
                addAuditLog("Toggle Language", `Language switched to ${updated}`);
              }}
              getCompleteState={getCompleteState}
            />
          )}

        </main>

        {/* Humble Footer */}
        <footer className="p-6 text-center border-t border-stone-100 dark:border-stone-800/60 bg-white/40 dark:bg-brand-dark-card/40 text-[10px] text-stone-400 font-semibold leading-normal">
          <div>{t.allRightsReserved}</div>
          <div className="mt-1 text-[8px] font-mono tracking-widest text-stone-300">SYSTEM STABLE • COMPILING 2026</div>
        </footer>

      </div>

    </div>
  );
}
