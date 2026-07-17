import React, { useState } from "react";
import { 
  Sun, Users, Calendar, DollarSign, CheckCircle, 
  AlertCircle, TrendingUp, Sparkles, RefreshCw, 
  Search, Plus, BookOpen, Clock, Heart
} from "lucide-react";
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, 
  Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from "recharts";
import { Student, Payment, Attendance, ClassSchedule, BusinessSettings } from "../types";
import { mockQuotes } from "../mockData";

interface DashboardProps {
  students: Student[];
  payments: Payment[];
  attendance: Attendance[];
  classes: ClassSchedule[];
  settings: BusinessSettings;
  role: string;
  lang: "English" | "Sinhala";
  t: any;
  onNavigate: (tab: string) => void;
  onQuickCheckIn: (studentId: string) => void;
  onQuickPayment: (studentId: string, amount: number) => void;
}

export default function Dashboard({
  students,
  payments,
  attendance,
  classes,
  settings,
  role,
  lang,
  t,
  onNavigate,
  onQuickCheckIn,
  onQuickPayment
}: DashboardProps) {
  const [quickSearchQuery, setQuickSearchQuery] = useState("");
  const [quickAmount, setQuickAmount] = useState<number>(0);
  const [selectedStudentForPay, setSelectedStudentForPay] = useState<string>("");
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [quoteIndex] = useState(() => Math.floor(Math.random() * mockQuotes.length));

  // Calculated Stats
  const activeStudents = students.filter(s => s.status === "Active");
  const inactiveStudents = students.filter(s => s.status === "Inactive");
  const pausedStudents = students.filter(s => s.status === "Paused");
  
  const currentMonthRevenue = payments
    .filter(p => p.status === "Paid" && p.date.startsWith("2026-07"))
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingPaymentsCount = payments.filter(p => p.status === "Pending").length;
  
  const todayAttendanceCount = attendance.filter(a => a.date === "2026-07-16" && a.status === "Present").length;
  const todayClassesCount = classes.length;

  // Birthdays today or this month (July)
  const birthdaysThisMonth = students.filter(s => {
    if (!s.dateOfBirth) return false;
    const month = s.dateOfBirth.split("-")[1];
    return month === "07"; // Simulated July
  });

  // Upcoming renewals (Membership expires in < 30 days)
  const activeMembershipsCount = activeStudents.length;

  // Charts data
  const revenueChartData = [
    { month: "Jan", revenue: 75000 },
    { month: "Feb", revenue: 95000 },
    { month: "Mar", revenue: 110000 },
    { month: "Apr", revenue: 85000 },
    { month: "May", revenue: 130000 },
    { month: "Jun", revenue: 115000 },
    { month: "Jul", revenue: currentMonthRevenue || 94500 }
  ];

  const attendanceChartData = [
    { name: "Mon", Present: 12, Absent: 3, Late: 2 },
    { name: "Tue", Present: 18, Absent: 2, Late: 1 },
    { name: "Wed", Present: 15, Absent: 4, Late: 3 },
    { name: "Thu", Present: 22, Absent: 1, Late: 2 },
    { name: "Fri", Present: 14, Absent: 5, Late: 1 },
    { name: "Sat", Present: 28, Absent: 2, Late: 0 },
    { name: "Sun", Present: 10, Absent: 1, Late: 1 }
  ];

  const growthChartData = [
    { month: "Jan", students: 10 },
    { month: "Feb", students: 14 },
    { month: "Mar", students: 19 },
    { month: "Apr", students: 25 },
    { month: "May", students: 31 },
    { month: "Jun", students: 38 },
    { month: "Jul", students: students.length }
  ];

  // Quick action search matches
  const matchedStudents = quickSearchQuery
    ? students.filter(s => s.fullName.toLowerCase().includes(quickSearchQuery.toLowerCase()))
    : [];

  // Generate Business Insights using server-side Gemini
  const fetchBusinessInsights = async () => {
    setLoadingAi(true);
    try {
      const stats = {
        totalStudents: students.length,
        activeStudents: activeStudents.length,
        inactiveStudents: inactiveStudents.length,
        currentRevenue: currentMonthRevenue,
        pendingPayments: pendingPaymentsCount,
        classesCount: todayClassesCount,
        attendancePercentage: "84%"
      };

      const res = await fetch("/api/gemini/business-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dashboardStats: stats })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAiInsights(data);
    } catch (err: any) {
      console.error(err);
      setAiInsights({
        revenueInsights: "Unable to reach Ayurva AI server. Here's a local tip: Summer attendance typically dips by 10%; consider introducing early morning Hatha sessions.",
        growthSuggestions: [
          "Offer corporate stress relief retreats for Colombo-based IT firms.",
          "Introduce a 'Bring a Friend' free Saturday sunset trial pack.",
          "Run a special 3-month package for Spine & Back Care Yoga."
        ],
        instructorTip: "Keep a fresh batch of herbal tea ready for morning students to foster immediate community building."
      });
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-6" id="dashboard-tab">
      {/* Top Welcome Panel */}
      <div className="bg-white dark:bg-brand-dark-card rounded-2xl p-6 shadow-sm border border-stone-100 dark:border-stone-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 font-medium">
            <span>{t.namaste}</span>
            <Sparkles className="w-4 h-4 text-brand-accent animate-pulse" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-stone-900 dark:text-white">
            {role === "Admin" ? "Kumodya Dilshani" : role === "Instructor" ? "Dilani Silva" : "Chamani De Silva"}
          </h1>
          <p className="text-stone-600 dark:text-stone-400 mt-1 text-sm">
            {t.todayClasses}: <span className="font-semibold text-brand-primary">{todayClassesCount} sessions</span> scheduled.
          </p>
        </div>

        {/* Local Quote & Weather */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch w-full md:w-auto">
          {/* Weather Widget */}
          <div className="bg-brand-bg dark:bg-brand-dark-bg px-4 py-3 rounded-xl flex items-center gap-3">
            <Sun className="w-8 h-8 text-amber-500 animate-spin-slow" />
            <div>
              <div className="font-semibold text-sm">Colombo, SL</div>
              <div className="text-xs text-stone-500 dark:text-stone-400">29°C • Sunny Serene</div>
            </div>
          </div>
          {/* Role Display */}
          <div className="bg-brand-primary/10 px-4 py-3 rounded-xl flex flex-col justify-center">
            <span className="text-xs text-brand-primary font-bold tracking-widest uppercase">System Role</span>
            <span className="text-sm font-semibold text-brand-primary">{role} View</span>
          </div>
        </div>
      </div>

      {/* Quote of the Day Banner */}
      <div className="bg-gradient-to-r from-brand-primary/5 via-brand-secondary/5 to-brand-primary/5 border border-brand-primary/10 rounded-xl p-4 text-center">
        <p className="text-stone-700 dark:text-stone-300 italic text-sm font-medium">
          "{mockQuotes[quoteIndex]}"
        </p>
        <span className="text-xs text-brand-primary font-semibold mt-1 inline-block">— Yoga Quote of the Day</span>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Active Students Widget */}
        <div className="bg-white dark:bg-brand-dark-card p-5 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 flex items-start justify-between">
          <div>
            <span className="text-xs font-bold text-stone-400 tracking-wider uppercase">Active Students</span>
            <h3 className="text-2xl font-bold mt-1 text-brand-primary">{activeStudents.length}</h3>
            <span className="text-[10px] text-stone-500 mt-1 inline-block">
              {pausedStudents.length} Paused • {inactiveStudents.length} Inactive
            </span>
          </div>
          <div className="p-2.5 bg-brand-primary/10 rounded-xl text-brand-primary">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Monthly Revenue Widget */}
        <div className="bg-white dark:bg-brand-dark-card p-5 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 flex items-start justify-between">
          <div>
            <span className="text-xs font-bold text-stone-400 tracking-wider uppercase">July Revenue</span>
            <h3 className="text-2xl font-bold mt-1 text-brand-primary">LKR {currentMonthRevenue.toLocaleString()}</h3>
            <span className="text-[10px] text-green-600 mt-1 inline-block font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +12% vs last month
            </span>
          </div>
          <div className="p-2.5 bg-brand-secondary/20 rounded-xl text-brand-primary font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Today's Attendance Widget */}
        <div className="bg-white dark:bg-brand-dark-card p-5 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 flex items-start justify-between">
          <div>
            <span className="text-xs font-bold text-stone-400 tracking-wider uppercase">Today Checked-In</span>
            <h3 className="text-2xl font-bold mt-1 text-brand-primary">{todayAttendanceCount}</h3>
            <span className="text-[10px] text-stone-500 mt-1 inline-block">
              Out of {activeStudents.length} members
            </span>
          </div>
          <div className="p-2.5 bg-brand-secondary/20 rounded-xl text-emerald-600">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        {/* Pending Payments Widget */}
        <div className="bg-white dark:bg-brand-dark-card p-5 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 flex items-start justify-between">
          <div>
            <span className="text-xs font-bold text-stone-400 tracking-wider uppercase">Overdue Payments</span>
            <h3 className="text-2xl font-bold mt-1 text-rose-500">{pendingPaymentsCount}</h3>
            <span className="text-[10px] text-rose-400 font-semibold mt-1 inline-block">
              Requires Reminders
            </span>
          </div>
          <div className="p-2.5 bg-rose-50 rounded-xl text-rose-500">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Charts & Quick Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Charts Container - Span 2 */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Revenue & Growth Chart */}
          <div className="bg-white dark:bg-brand-dark-card p-5 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800">
            <h4 className="text-base font-bold text-stone-800 dark:text-white mb-4">Monthly Financial Revenue</h4>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`LKR ${value}`, "Revenue"]} />
                  <Bar dataKey="revenue" fill="#0D4F51" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Attendance Trends */}
          <div className="bg-white dark:bg-brand-dark-card p-5 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800">
            <h4 className="text-base font-bold text-stone-800 dark:text-white mb-4">Weekly Attendance Distribution</h4>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceChartData}>
                  <defs>
                    <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0D4F51" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#0D4F51" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="Present" stroke="#0D4F51" fillOpacity={1} fill="url(#colorPresent)" />
                  <Area type="monotone" dataKey="Late" stroke="#D4AF37" fillOpacity={0.1} fill="#D4AF37" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Quick Actions & AI Sidebar - Span 1 */}
        <div className="space-y-6">
          
          {/* Quick Check-In / Search Action */}
          <div className="bg-white dark:bg-brand-dark-card p-5 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-base font-bold text-stone-800 dark:text-white flex items-center gap-1.5">
                <Search className="w-4 h-4 text-brand-primary" />
                Quick Student Check-In
              </h4>
            </div>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Search student name or phone..."
                value={quickSearchQuery}
                onChange={(e) => setQuickSearchQuery(e.target.value)}
                className="w-full text-sm bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            {quickSearchQuery && (
              <div className="bg-stone-50 dark:bg-brand-dark-bg rounded-xl p-2 max-h-[160px] overflow-y-auto space-y-1.5 border border-stone-100 dark:border-stone-800">
                {matchedStudents.length > 0 ? (
                  matchedStudents.map(student => (
                    <div key={student.id} className="flex justify-between items-center p-2 hover:bg-white dark:hover:bg-brand-dark-card rounded-lg transition-all border border-transparent hover:border-stone-200 dark:hover:border-stone-800">
                      <div>
                        <div className="text-xs font-bold text-stone-800 dark:text-white">{student.fullName}</div>
                        <div className="text-[10px] text-stone-500">{student.id} • {student.phone}</div>
                      </div>
                      <button
                        onClick={() => {
                          onQuickCheckIn(student.id);
                          setQuickSearchQuery("");
                        }}
                        className="text-[10px] bg-brand-primary hover:bg-brand-primary/90 text-white px-2 py-1 rounded font-semibold"
                      >
                        Check-In
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-stone-500 text-center py-2">No students found.</div>
                )}
              </div>
            )}

            <div className="text-xs text-stone-500 dark:text-stone-400">
              * Instantly checks in student with 'Present' status for today's morning class.
            </div>
          </div>

          {/* Quick Payment Entry */}
          <div className="bg-white dark:bg-brand-dark-card p-5 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 space-y-4">
            <h4 className="text-base font-bold text-stone-800 dark:text-white flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-brand-primary" />
              Quick Payment Logger
            </h4>
            
            <div className="space-y-3">
              <select
                value={selectedStudentForPay}
                onChange={(e) => setSelectedStudentForPay(e.target.value)}
                className="w-full text-xs bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                <option value="">Select Student...</option>
                {activeStudents.map(s => (
                  <option key={s.id} value={s.id}>{s.fullName} ({s.id})</option>
                ))}
              </select>

              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Amount LKR..."
                  value={quickAmount || ""}
                  onChange={(e) => setQuickAmount(Number(e.target.value))}
                  className="w-full text-xs bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
                <button
                  disabled={!selectedStudentForPay || !quickAmount}
                  onClick={() => {
                    onQuickPayment(selectedStudentForPay, quickAmount);
                    setSelectedStudentForPay("");
                    setQuickAmount(0);
                  }}
                  className="bg-brand-primary hover:bg-brand-primary/90 disabled:bg-stone-300 text-white font-semibold text-xs px-4 rounded-xl transition-all"
                >
                  Record
                </button>
              </div>
            </div>
          </div>

          {/* Ayurva AI Business Insights */}
          <div className="bg-white dark:bg-brand-dark-card text-stone-900 rounded-2xl p-5 shadow-sm border border-stone-200 dark:border-stone-800 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-5 h-5 text-brand-accent" />
                <h4 className="font-bold text-sm tracking-wide text-stone-900">Ayurva AI Studio Insights</h4>
              </div>
              <button 
                onClick={fetchBusinessInsights}
                disabled={loadingAi}
                className="text-stone-400 hover:text-stone-700 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loadingAi ? "animate-spin" : ""}`} />
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Generate intelligent predictions, growth paths, and recommendations customized to this month's revenue and attendance metrics.
            </p>

            {!aiInsights ? (
              <button
                onClick={fetchBusinessInsights}
                disabled={loadingAi}
                className="w-full bg-brand-primary text-xs font-semibold py-2.5 rounded-xl hover:bg-brand-primary/95 transition-all text-center flex items-center justify-center gap-1.5 text-white"
              >
                {loadingAi ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Connecting Gemini...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
                    Request AI Business Audit
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-3 pt-2 text-stone-700 border-t border-stone-100 text-xs">
                <div>
                  <div className="font-bold text-brand-primary">Revenue & Trend Insight:</div>
                  <div className="text-[11px] text-stone-600 mt-1 leading-normal">{aiInsights.revenueInsights || aiInsights.attendanceTrendSummary}</div>
                </div>

                <div>
                  <div className="font-bold text-brand-accent">Growth Ideas:</div>
                  <ul className="list-disc list-inside space-y-1 mt-1 text-[11px] text-stone-600">
                    {aiInsights.growthSuggestions?.map((s: string, i: number) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-stone-50 dark:bg-brand-dark-bg p-2.5 rounded-xl border border-stone-200 flex items-start gap-2">
                  <Heart className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-[10px] text-stone-800">Tip for Kumodya:</div>
                    <div className="text-[10px] text-stone-600 leading-normal mt-0.5">{aiInsights.instructorTip}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
