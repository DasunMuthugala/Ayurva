import React, { useState } from "react";
import { 
  Check, X, Search, Calendar, AlertCircle, Clock, 
  UserCheck, RefreshCw, ChevronLeft, ChevronRight,
  Filter, User, CheckCircle2, AlertTriangle, FileText,
  Clock3, ShieldAlert, ArrowLeftRight, HelpCircle, Smartphone
} from "lucide-react";
import { Student, Attendance, ClassSchedule } from "../types";

interface AttendanceSystemProps {
  students: Student[];
  attendance: Attendance[];
  classes: ClassSchedule[];
  onMarkAttendance: (attendance: Attendance) => void;
  onUpdateAttendance: (id: string, status: any) => void;
  role: string;
}

export default function AttendanceSystem({
  students,
  attendance,
  classes,
  onMarkAttendance,
  onUpdateAttendance,
  role
}: AttendanceSystemProps) {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<"mark" | "history">("mark");

  // Mark Attendance States
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || "");
  const [selectedDate, setSelectedDate] = useState("2026-07-16"); // Default simulated today
  const [rosterSearch, setRosterSearch] = useState("");
  const [onlyClassMembers, setOnlyClassMembers] = useState(true);

  // Self Check-In inputs (ID or Phone)
  const [selfCheckInInput, setSelfCheckInInput] = useState("");
  const [selfCheckInSuccess, setSelfCheckInSuccess] = useState<string | null>(null);
  const [selfCheckInError, setSelfCheckInError] = useState<string | null>(null);

  // History Tab States
  const [historySearch, setHistorySearch] = useState("");
  const [historyClassId, setHistoryClassId] = useState("All");
  const [historyDate, setHistoryDate] = useState("");
  const [historyStatus, setHistoryStatus] = useState("All");

  // Get active class info
  const activeClass = classes.find(c => c.id === selectedClassId) || classes[0];

  // List of active students
  const activeStudents = students.filter(s => s.status === "Active");

  // Class members (students linked to the active class)
  const classMembers = activeStudents.filter(s => s.classId === selectedClassId);

  // Final list of students to display in the roster based on user toggle
  const rosterStudents = onlyClassMembers ? classMembers : activeStudents;

  // Filter roster by name or ID search
  const filteredRoster = rosterStudents.filter(s => 
    s.fullName.toLowerCase().includes(rosterSearch.toLowerCase()) ||
    s.id.toLowerCase().includes(rosterSearch.toLowerCase())
  );

  // Get attendance records for the selected class on the selected date
  const selectedClassAttendance = attendance.filter(
    a => a.classId === selectedClassId && a.date === selectedDate
  );

  // Quick stats for the selected class today
  const totalEnrolled = classMembers.length;
  const totalPresent = selectedClassAttendance.filter(a => a.status === "Present" || a.status === "Late").length;
  const attendancePercentage = totalEnrolled > 0 ? Math.round((totalPresent / totalEnrolled) * 100) : 0;

  // Handler to mark / update attendance
  const handleMarkStatus = (student: Student, status: "Present" | "Absent" | "Late" | "Excused") => {
    const existing = attendance.find(
      a => a.studentId === student.id && a.classId === selectedClassId && a.date === selectedDate
    );

    if (existing) {
      onUpdateAttendance(existing.id, status);
    } else {
      const newAtt: Attendance = {
        id: `att-${Date.now()}-${student.id}`,
        studentId: student.id,
        studentName: student.fullName,
        classId: selectedClassId,
        className: activeClass?.name || "Yoga Class",
        date: selectedDate,
        status,
        checkInTime: new Date().toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: false }),
        method: "Manual"
      };
      onMarkAttendance(newAtt);
    }
  };

  // Handler to remove / reset attendance
  const handleResetStatus = (studentId: string) => {
    const existing = attendance.find(
      a => a.studentId === studentId && a.classId === selectedClassId && a.date === selectedDate
    );
    if (existing) {
      // In a real database, we would delete this record.
      // In this system, we can update its status to Excused or mark it in some other way,
      // or we can set it to a status that represents "Unmarked", but the easiest way to reset in this mock state
      // is to use onUpdateAttendance or we can just leave it as "Absent" or change it.
      // Let's change it to a default "Absent" or delete it from list if possible.
      // Since App.tsx has handleUpdateAttendance, let's just mark them as Absent or allow quick toggling.
    }
  };

  // Self Check-in Submission
  const handleSelfCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    setSelfCheckInSuccess(null);
    setSelfCheckInError(null);

    const input = selfCheckInInput.trim();
    if (!input) return;

    // Find student by ID or exact phone
    const student = activeStudents.find(
      s => s.id.toLowerCase() === input.toLowerCase() || 
           s.phone.replace(/\s+/g, "").includes(input.replace(/\s+/g, ""))
    );

    if (!student) {
      setSelfCheckInError("Student not found. Please enter a valid Student ID or Registered Phone Number.");
      return;
    }

    // Check if already checked in for active class on selectedDate
    const existing = attendance.find(
      a => a.studentId === student.id && a.classId === selectedClassId && a.date === selectedDate
    );

    if (existing && existing.status === "Present") {
      setSelfCheckInSuccess(`Already Checked In! ${student.fullName} is already marked Present.`);
      setSelfCheckInInput("");
      return;
    }

    // Record check-in
    if (existing) {
      onUpdateAttendance(existing.id, "Present");
    } else {
      const newAtt: Attendance = {
        id: `att-${Date.now()}-${student.id}`,
        studentId: student.id,
        studentName: student.fullName,
        classId: selectedClassId,
        className: activeClass?.name || "Yoga Class",
        date: selectedDate,
        status: "Present",
        checkInTime: new Date().toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: false }),
        method: "PIN"
      };
      onMarkAttendance(newAtt);
    }

    setSelfCheckInSuccess(`Success! ${student.fullName} has checked in for ${activeClass?.name || "class"}.`);
    setSelfCheckInInput("");
  };

  // History Filter logic
  const filteredHistory = attendance.filter(record => {
    const matchesSearch = record.studentName.toLowerCase().includes(historySearch.toLowerCase()) ||
                          record.studentId.toLowerCase().includes(historySearch.toLowerCase());
    const matchesClass = historyClassId === "All" || record.classId === historyClassId;
    const matchesDate = !historyDate || record.date === historyDate;
    const matchesStatus = historyStatus === "All" || record.status === historyStatus;

    return matchesSearch && matchesClass && matchesDate && matchesStatus;
  });

  // History Statistics calculations
  const totalHistoryRecords = filteredHistory.length;
  const historyPresent = filteredHistory.filter(r => r.status === "Present").length;
  const historyLate = filteredHistory.filter(r => r.status === "Late").length;
  const historyAbsent = filteredHistory.filter(r => r.status === "Absent").length;
  const historyExcused = filteredHistory.filter(r => r.status === "Excused").length;

  const presentPercentage = totalHistoryRecords > 0 ? Math.round((historyPresent / totalHistoryRecords) * 100) : 0;
  const latePercentage = totalHistoryRecords > 0 ? Math.round((historyLate / totalHistoryRecords) * 100) : 0;
  const absentPercentage = totalHistoryRecords > 0 ? Math.round((historyAbsent / totalHistoryRecords) * 100) : 0;

  // Identify high-risk low attendance students (< 50% present rate)
  const lowAttendanceStudents = students.filter(student => {
    if (student.status !== "Active") return false;
    const studentHistory = attendance.filter(a => a.studentId === student.id);
    if (studentHistory.length === 0) return true; // Flag if has no records yet
    const presentCount = studentHistory.filter(a => a.status === "Present" || a.status === "Late").length;
    const rate = presentCount / studentHistory.length;
    return rate < 0.50;
  });

  return (
    <div className="space-y-6">
      
      {/* Dynamic Header & Switch Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-brand-dark-card p-5 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm gap-4">
        <div>
          <h3 className="font-bold text-lg text-stone-900 dark:text-white">Attendance Control Centre</h3>
          <p className="text-[11px] text-stone-500">Track class check-ins, record daily rosters, and view student history.</p>
        </div>

        <div className="flex bg-stone-100 dark:bg-brand-dark-bg p-1 rounded-xl border border-stone-200/40 dark:border-stone-800">
          <button
            onClick={() => setActiveTab("mark")}
            className={`text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "mark" 
                ? "bg-white dark:bg-brand-dark-card shadow text-brand-primary" 
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Mark Attendance
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "history" 
                ? "bg-white dark:bg-brand-dark-card shadow text-brand-primary" 
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Attendance History
          </button>
        </div>
      </div>

      {/* 1. MARK ATTENDANCE TAB */}
      {activeTab === "mark" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Attendance Sheet (Span 2) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Control Panel: Class & Date selection */}
            <div className="bg-white dark:bg-brand-dark-card p-5 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1">Select Yoga Class</label>
                  <select
                    value={selectedClassId}
                    onChange={(e) => {
                      setSelectedClassId(e.target.value);
                      setRosterSearch("");
                    }}
                    className="w-full text-xs font-semibold bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-primary text-stone-800 dark:text-white"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.startTime} - {c.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1">Attendance Date</label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full text-xs font-semibold bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-primary text-stone-800 dark:text-white"
                    />
                    <button
                      onClick={() => setSelectedDate("2026-07-16")}
                      className="text-[10px] bg-brand-primary/10 text-brand-primary font-bold px-2.5 rounded-xl hover:bg-brand-primary/20 transition-all shrink-0"
                      title="Reset to simulated today"
                    >
                      Today
                    </button>
                  </div>
                </div>

              </div>

              {/* Class Info & Daily Stats */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-50 dark:border-stone-800/60 text-xs">
                <div className="text-stone-500">
                  Instructor: <span className="font-bold text-stone-800 dark:text-white">{activeClass?.instructorName}</span> 
                  <span className="mx-2">•</span>
                  City: <span className="font-bold text-brand-primary bg-brand-primary/5 px-2 py-0.5 rounded">{activeClass?.city}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-stone-500">
                    Daily Presence: <span className="text-brand-primary font-black">{totalPresent}</span> / {totalEnrolled} members
                  </span>
                  <div className="w-20 bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-brand-primary transition-all duration-300" 
                      style={{ width: `${attendancePercentage}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] font-black text-brand-primary bg-brand-primary/10 px-1.5 py-0.5 rounded">
                    {attendancePercentage}%
                  </span>
                </div>
              </div>
            </div>

            {/* Attendance List */}
            <div className="bg-white dark:bg-brand-dark-card rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 p-5 space-y-4">
              
              {/* Filter controls */}
              <div className="flex flex-col sm:flex-row gap-3 justify-between items-center pb-3 border-b border-stone-50 dark:border-stone-800/80">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search student by name or ID..."
                    value={rosterSearch}
                    onChange={(e) => setRosterSearch(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2 bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary text-stone-800 dark:text-white"
                  />
                </div>

                {/* Show member filter toggler */}
                <button
                  onClick={() => setOnlyClassMembers(!onlyClassMembers)}
                  className={`text-xs font-semibold px-3 py-2 rounded-xl border flex items-center gap-1.5 transition-all ${
                    onlyClassMembers 
                      ? "bg-brand-primary/10 border-brand-primary/30 text-brand-primary" 
                      : "bg-stone-50 dark:bg-brand-dark-bg border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300"
                  }`}
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  {onlyClassMembers ? "Showing Class Members Only" : "Showing All Studio Students"}
                </button>
              </div>

              {/* Roster Grid */}
              <div className="divide-y divide-stone-100 dark:divide-stone-800 max-h-[480px] overflow-y-auto pr-1">
                {filteredRoster.map(student => {
                  const checkRecord = attendance.find(
                    a => a.studentId === student.id && a.classId === selectedClassId && a.date === selectedDate
                  );
                  const status = checkRecord?.status;

                  return (
                    <div key={student.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-3.5 gap-3">
                      
                      {/* Student Info */}
                      <div className="flex items-center gap-3">
                        <img
                          src={student.photoUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150"}
                          alt={student.fullName}
                          className="w-10 h-10 rounded-full object-cover border border-stone-100 dark:border-stone-800"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="text-xs font-bold text-stone-900 dark:text-white leading-tight flex items-center gap-2">
                            {student.fullName}
                            {student.classId === selectedClassId && (
                              <span className="text-[9px] bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 px-1.5 py-0.5 rounded font-black tracking-wide uppercase">
                                Enrolled
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-stone-500 mt-1 flex flex-wrap items-center gap-2">
                            <span>ID: {student.id}</span>
                            <span>•</span>
                            <span>City: {student.city}</span>
                            {student.className && (
                              <>
                                <span>•</span>
                                <span className="text-brand-primary font-semibold">Home Class: {student.className}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Status Buttons */}
                      <div className="flex flex-wrap items-center gap-1.5 self-end sm:self-center">
                        <button
                          onClick={() => handleMarkStatus(student, "Present")}
                          className={`text-[10px] font-bold px-3 py-2 rounded-xl transition-all flex items-center gap-1 ${
                            status === "Present" 
                              ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/20" 
                              : "bg-stone-50 dark:bg-brand-dark-bg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200/60 dark:border-stone-700/60"
                          }`}
                        >
                          <Check className="w-3 h-3" />
                          Present
                        </button>

                        <button
                          onClick={() => handleMarkStatus(student, "Late")}
                          className={`text-[10px] font-bold px-3 py-2 rounded-xl transition-all flex items-center gap-1 ${
                            status === "Late" 
                              ? "bg-amber-500 text-white shadow-sm ring-2 ring-amber-500/20" 
                              : "bg-stone-50 dark:bg-brand-dark-bg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200/60 dark:border-stone-700/60"
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          Late
                        </button>

                        <button
                          onClick={() => handleMarkStatus(student, "Absent")}
                          className={`text-[10px] font-bold px-3 py-2 rounded-xl transition-all flex items-center gap-1 ${
                            status === "Absent" 
                              ? "bg-rose-500 text-white shadow-sm ring-2 ring-rose-500/20" 
                              : "bg-stone-50 dark:bg-brand-dark-bg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200/60 dark:border-stone-700/60"
                          }`}
                        >
                          <X className="w-3 h-3" />
                          Absent
                        </button>

                        <button
                          onClick={() => handleMarkStatus(student, "Excused")}
                          className={`text-[10px] font-bold px-3 py-2 rounded-xl transition-all flex items-center gap-1 ${
                            status === "Excused" 
                              ? "bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-600/20" 
                              : "bg-stone-50 dark:bg-brand-dark-bg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200/60 dark:border-stone-700/60"
                          }`}
                        >
                          <HelpCircle className="w-3 h-3" />
                          Excused
                        </button>
                      </div>

                    </div>
                  );
                })}

                {filteredRoster.length === 0 && (
                  <div className="text-center py-12 text-stone-500 space-y-2">
                    <AlertCircle className="w-8 h-8 text-stone-300 mx-auto" />
                    <p className="text-xs font-medium">No active students match this filter.</p>
                    <p className="text-[10px] text-stone-400">Try toggling "Showing All Studio Students" to search walk-ins!</p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Sidebar Tools: Self Check-In Terminal & Warnings */}
          <div className="space-y-6">
            
            {/* Self Check-In Terminal */}
            <div className="bg-white dark:bg-brand-dark-card p-5 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 space-y-4">
              <div className="border-b pb-2">
                <h4 className="font-bold text-xs text-stone-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-brand-primary" />
                  Quick Self Check-In
                </h4>
                <p className="text-[10px] text-stone-500 mt-1">Students can type their Student ID or Phone number below to instantly register presence.</p>
              </div>

              <form onSubmit={handleSelfCheckIn} className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. AYUR-2026-001 or Phone..."
                    value={selfCheckInInput}
                    onChange={(e) => {
                      setSelfCheckInInput(e.target.value);
                      setSelfCheckInSuccess(null);
                      setSelfCheckInError(null);
                    }}
                    className="w-full text-xs font-bold font-mono px-3 py-2.5 bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary uppercase text-stone-800 dark:text-white placeholder:normal-case"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-primary hover:bg-brand-primary/95 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow"
                >
                  Verify & Check-In
                </button>
              </form>

              {selfCheckInSuccess && (
                <div className="bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/20 text-emerald-800 dark:text-emerald-400 text-[10px] font-semibold p-3 rounded-xl flex items-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                  <span>{selfCheckInSuccess}</span>
                </div>
              )}

              {selfCheckInError && (
                <div className="bg-rose-50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/20 text-rose-800 dark:text-rose-400 text-[10px] font-semibold p-3 rounded-xl flex items-start gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{selfCheckInError}</span>
                </div>
              )}
            </div>

            {/* Attendance Analytics Flag Warnings */}
            <div className="bg-rose-50/40 dark:bg-rose-950/5 border border-rose-100 dark:border-rose-950/20 p-5 rounded-2xl space-y-3 text-xs">
              <h4 className="font-bold text-rose-800 dark:text-rose-400 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                Critical Low Attendance (&lt; 50%)
              </h4>
              <p className="text-[10px] text-stone-500 leading-normal">
                These students have missed too many of their historical classes and are at risk of dropping out.
              </p>

              <div className="space-y-2 pt-1 border-t border-rose-100 dark:border-rose-950/10">
                {lowAttendanceStudents.slice(0, 4).map(student => (
                  <div key={student.id} className="flex justify-between items-center bg-white dark:bg-brand-dark-card p-2.5 rounded-xl border border-rose-50 dark:border-stone-800">
                    <div>
                      <div className="font-bold text-stone-800 dark:text-white text-[11px]">{student.fullName}</div>
                      <div className="text-[9px] text-stone-400 font-mono mt-0.5">{student.id}</div>
                    </div>
                    <button
                      onClick={() => {
                        const template = `Namaste ${student.fullName}, we've missed your bright energy at Ayurva Yoga recently! Let us know if you need any assistance or schedule flexible adjustments. See you soon! 🙏✨`;
                        const link = `https://wa.me/${student.whatsApp.replace(/\D/g, "")}?text=${encodeURIComponent(template)}`;
                        window.open(link, "_blank");
                      }}
                      className="text-[9px] bg-emerald-100 hover:bg-emerald-200 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 px-2 py-1 rounded-md font-bold transition-all"
                    >
                      WhatsApp
                    </button>
                  </div>
                ))}

                {lowAttendanceStudents.length === 0 && (
                  <div className="text-[10px] text-stone-400 text-center py-4">No active students marked under 50% attendance! Excellent.</div>
                )}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 2. ATTENDANCE HISTORY TAB */}
      {activeTab === "history" && (
        <div className="space-y-6">
          
          {/* Quick Stats Panel */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="bg-white dark:bg-brand-dark-card p-4 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm">
              <span className="text-[10px] font-bold text-stone-400 uppercase">Total Records</span>
              <div className="text-xl font-black text-stone-900 dark:text-white mt-1">{totalHistoryRecords}</div>
              <p className="text-[9px] text-stone-500 mt-1">Filtered from system logs</p>
            </div>

            <div className="bg-white dark:bg-brand-dark-card p-4 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm">
              <span className="text-[10px] font-bold text-stone-400 uppercase">Present Rate</span>
              <div className="text-xl font-black text-emerald-600 mt-1">{presentPercentage}%</div>
              <p className="text-[9px] text-stone-500 mt-1">{historyPresent} present logs</p>
            </div>

            <div className="bg-white dark:bg-brand-dark-card p-4 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm">
              <span className="text-[10px] font-bold text-stone-400 uppercase">Late Rate</span>
              <div className="text-xl font-black text-amber-500 mt-1">{latePercentage}%</div>
              <p className="text-[9px] text-stone-500 mt-1">{historyLate} late entries</p>
            </div>

            <div className="bg-white dark:bg-brand-dark-card p-4 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm">
              <span className="text-[10px] font-bold text-stone-400 uppercase">Absence Rate</span>
              <div className="text-xl font-black text-rose-500 mt-1">{absentPercentage}%</div>
              <p className="text-[9px] text-stone-500 mt-1">{historyAbsent} absent logs</p>
            </div>

          </div>

          {/* Interactive Filters Grid */}
          <div className="bg-white dark:bg-brand-dark-card p-5 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 space-y-4">
            
            <h4 className="font-bold text-xs text-stone-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-brand-primary" />
              Filter Historical Logs
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              
              <div>
                <label className="block text-[10px] text-stone-500 mb-1 font-semibold">Search Student</label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by name or ID..."
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    className="w-full text-xs pl-8.5 pr-2 py-2 bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-stone-500 mb-1 font-semibold">Filter Class</label>
                <select
                  value={historyClassId}
                  onChange={(e) => setHistoryClassId(e.target.value)}
                  className="w-full text-xs py-2 px-2 bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl"
                >
                  <option value="All">All Classes</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-stone-500 mb-1 font-semibold">Specific Date</label>
                <input
                  type="date"
                  value={historyDate}
                  onChange={(e) => setHistoryDate(e.target.value)}
                  className="w-full text-xs py-1.5 px-2 bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-[10px] text-stone-500 mb-1 font-semibold">Status</label>
                <select
                  value={historyStatus}
                  onChange={(e) => setHistoryStatus(e.target.value)}
                  className="w-full text-xs py-2 px-2 bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl"
                >
                  <option value="All">All Statuses</option>
                  <option value="Present">Present</option>
                  <option value="Late">Late</option>
                  <option value="Absent">Absent</option>
                  <option value="Excused">Excused</option>
                </select>
              </div>

            </div>

            <div className="flex justify-between items-center pt-2 border-t border-stone-50 dark:border-stone-800">
              <p className="text-[11px] text-stone-500">
                Found <span className="font-bold text-brand-primary">{filteredHistory.length}</span> recorded entries.
              </p>

              {(historySearch || historyClassId !== "All" || historyDate || historyStatus !== "All") && (
                <button
                  onClick={() => {
                    setHistorySearch("");
                    setHistoryClassId("All");
                    setHistoryDate("");
                    setHistoryStatus("All");
                  }}
                  className="text-[10px] text-brand-primary hover:underline font-bold"
                >
                  Clear Active Filters
                </button>
              )}
            </div>

          </div>

          {/* Historical Logs List / Table */}
          <div className="bg-white dark:bg-brand-dark-card rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 overflow-hidden">
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                
                <thead>
                  <tr className="bg-stone-50 dark:bg-brand-dark-bg/50 border-b border-stone-100 dark:border-stone-800 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-5">Student</th>
                    <th className="py-3 px-4">Yoga Class</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Check-In Time / Method</th>
                    <th className="py-3 px-4">Current Status</th>
                    <th className="py-3 px-4 text-right">Instant Correction</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-stone-100 dark:divide-stone-800/80">
                  {filteredHistory.map((record, index) => {
                    // Find student profile photo
                    const studentProfile = students.find(s => s.id === record.studentId);

                    return (
                      <tr key={record.id || index} className="hover:bg-stone-50/50 dark:hover:bg-brand-dark-bg/20 transition-all">
                        
                        {/* Student Column */}
                        <td className="py-3 px-5">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={studentProfile?.photoUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150"}
                              className="w-7 h-7 rounded-full object-cover border border-stone-100 dark:border-stone-800"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <div className="font-bold text-stone-900 dark:text-white">{record.studentName}</div>
                              <div className="text-[10px] text-stone-400 font-mono">{record.studentId}</div>
                            </div>
                          </div>
                        </td>

                        {/* Class Column */}
                        <td className="py-3 px-4">
                          <span className="font-semibold text-stone-800 dark:text-stone-200">{record.className}</span>
                        </td>

                        {/* Date Column */}
                        <td className="py-3 px-4 font-semibold text-stone-600 dark:text-stone-300">
                          {record.date}
                        </td>

                        {/* Time / Method Column */}
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-stone-400" />
                              {record.checkInTime || "No Time"}
                            </span>
                            <span className="text-[9px] font-bold text-brand-primary uppercase mt-0.5">{record.method}</span>
                          </div>
                        </td>

                        {/* Status Column */}
                        <td className="py-3 px-4">
                          <span className={`inline-block text-[10px] font-bold px-2 py-1 rounded-lg ${
                            record.status === "Present" 
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400" 
                              : record.status === "Late"
                                ? "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                                : record.status === "Absent"
                                  ? "bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400"
                                  : "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400"
                          }`}>
                            {record.status}
                          </span>
                        </td>

                        {/* Change Status Action Column */}
                        <td className="py-3 px-4 text-right">
                          <select
                            value={record.status}
                            onChange={(e) => onUpdateAttendance(record.id, e.target.value as any)}
                            className="text-[10px] font-bold py-1 px-1.5 bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-lg text-stone-700 dark:text-stone-300 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                          >
                            <option value="Present">Present</option>
                            <option value="Late">Late</option>
                            <option value="Absent">Absent</option>
                            <option value="Excused">Excused</option>
                          </select>
                        </td>

                      </tr>
                    );
                  })}

                  {filteredHistory.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-stone-500">
                        <AlertCircle className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                        <p className="text-xs font-semibold">No attendance entries matched the active filters.</p>
                        <p className="text-[10px] text-stone-400">Clear filters to view complete logs.</p>
                      </td>
                    </tr>
                  )}
                </tbody>

              </table>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
