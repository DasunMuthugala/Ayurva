import React, { useState } from "react";
import { 
  FileText, Plus, Phone, AlertCircle, TrendingUp, CheckCircle, 
  XCircle, Download, FileSpreadsheet, Printer, BarChart2, Calendar, Mail
} from "lucide-react";
import { Student, Payment, Attendance, Inquiry, TrialClass, Expense } from "../types";

interface InquiriesReportsProps {
  students: Student[];
  payments: Payment[];
  attendance: Attendance[];
  inquiries: Inquiry[];
  trials: TrialClass[];
  expenses: Expense[];
  onAddInquiry: (inquiry: Inquiry) => void;
  onUpdateInquiryStatus: (id: string, status: any) => void;
  role: string;
}

export default function InquiriesReports({
  students,
  payments,
  attendance,
  inquiries,
  trials,
  expenses,
  onAddInquiry,
  onUpdateInquiryStatus,
  role
}: InquiriesReportsProps) {
  const [activeSubTab, setActiveSubTab] = useState<"Inquiries" | "Reports">("Inquiries");
  
  // Inquiry form states
  const [showInqModal, setShowInqModal] = useState(false);
  const [newInq, setNewInq] = useState<Partial<Inquiry>>({
    name: "",
    phone: "",
    source: "Facebook",
    status: "Interested",
    notes: "",
    followUpDate: "2026-07-20"
  });

  // Reporting states
  const [reportPeriod, setReportPeriod] = useState<"Daily" | "Weekly" | "Monthly" | "Yearly">("Monthly");
  
  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInq.name || !newInq.phone) {
      alert("Name and Phone are required.");
      return;
    }

    const inqToAdd: Inquiry = {
      id: `inq-${Date.now()}`,
      name: newInq.name,
      phone: newInq.phone,
      source: newInq.source as any || "Facebook",
      status: newInq.status as any || "Interested",
      date: new Date().toISOString().split("T")[0],
      notes: newInq.notes || "",
      followUpDate: newInq.followUpDate || "2026-07-20"
    };

    onAddInquiry(inqToAdd);
    setShowInqModal(false);
    setNewInq({ name: "", phone: "", source: "Facebook", status: "Interested", notes: "", followUpDate: "2026-07-20" });
    alert("Inquiry logged successfully!");
  };

  // Inquiry Conversion math
  const totalInquiries = inquiries.length;
  const joinedInquiries = inquiries.filter(i => i.status === "Joined").length;
  const trialInquiries = inquiries.filter(i => i.status === "Trial").length;
  const conversionRate = totalInquiries > 0 ? Math.round((joinedInquiries / totalInquiries) * 100) : 0;

  // Trial conversion
  const totalTrials = trials.length;
  const convertedTrials = trials.filter(t => t.converted).length;
  const trialConversionRate = totalTrials > 0 ? Math.round((convertedTrials / totalTrials) * 100) : 0;

  // Financial calculations for Reports
  const totalRevenue = payments.filter(p => p.status === "Paid").reduce((s, p) => s + p.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  // Inactive Students
  const inactiveRoster = students.filter(s => s.status === "Inactive");

  // Top Attendees (Students with highest present checks)
  const attendeeCounts = students.reduce((acc, student) => {
    const checks = attendance.filter(a => a.studentId === student.id && a.status === "Present").length;
    acc.push({ name: student.fullName, id: student.id, count: checks });
    return acc;
  }, [] as { name: string, id: string, count: number }[]);
  
  const topAttendees = attendeeCounts.sort((a, b) => b.count - a.count).slice(0, 3);

  // CSV Exporter helper
  const exportToCSV = (data: any[], filename: string) => {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (data.length > 0) {
      const headers = Object.keys(data[0]).join(",");
      csvContent += headers + "\r\n";
      data.forEach(row => {
        const line = Object.values(row).map(val => `"${val}"`).join(",");
        csvContent += line + "\r\n";
      });
    }
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Tab select bar */}
      <div className="flex border-b border-stone-200/60 dark:border-stone-800">
        <button
          onClick={() => setActiveSubTab("Inquiries")}
          className={`px-5 py-3 font-bold text-xs uppercase tracking-wider border-b-2 transition-all ${
            activeSubTab === "Inquiries" 
              ? "border-brand-primary text-brand-primary" 
              : "border-transparent text-stone-400 hover:text-stone-600"
          }`}
        >
          Inquiry & Trial tracker
        </button>
        <button
          onClick={() => setActiveSubTab("Reports")}
          className={`px-5 py-3 font-bold text-xs uppercase tracking-wider border-b-2 transition-all ${
            activeSubTab === "Reports" 
              ? "border-brand-primary text-brand-primary" 
              : "border-transparent text-stone-400 hover:text-stone-600"
          }`}
        >
          Studio Business Reports
        </button>
      </div>

      {activeSubTab === "Inquiries" ? (
        <div className="space-y-6">
          
          {/* Conversions stats bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="bg-white dark:bg-brand-dark-card p-5 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-400 font-bold uppercase">Inquiry Conversion</span>
                <h3 className="text-2xl font-bold mt-1 text-brand-primary">{conversionRate}%</h3>
                <span className="text-[10px] text-stone-500">{joinedInquiries} of {totalInquiries} leads joined</span>
              </div>
              <div className="p-3 bg-brand-primary/10 rounded-full text-brand-primary">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white dark:bg-brand-dark-card p-5 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-400 font-bold uppercase">Trial Conversion Rate</span>
                <h3 className="text-2xl font-bold mt-1 text-emerald-600">{trialConversionRate}%</h3>
                <span className="text-[10px] text-stone-500">{convertedTrials} of {totalTrials} trials converted</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-full text-emerald-600">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white dark:bg-brand-dark-card p-5 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-400 font-bold uppercase">Pending Follow-Ups</span>
                <h3 className="text-2xl font-bold mt-1 text-amber-500">
                  {inquiries.filter(i => i.status === "Interested" || i.status === "Trial").length}
                </h3>
                <span className="text-[10px] text-stone-500">Requires warm checks</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-full text-amber-500">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>

          </div>

          {/* Action Header bar */}
          <div className="bg-white dark:bg-brand-dark-card p-4 rounded-xl border border-stone-100 dark:border-stone-800 shadow-sm flex justify-between items-center">
            <div>
              <h4 className="font-bold text-sm text-stone-900 dark:text-white">Active Social Leads Directory</h4>
              <p className="text-[10px] text-stone-500">Track incoming Instagram, Facebook and Walk-in queries</p>
            </div>

            <button
              onClick={() => setShowInqModal(true)}
              className="bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Log New Inquiry
            </button>
          </div>

          {/* Inquiries List */}
          <div className="bg-white dark:bg-brand-dark-card rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 p-5 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-100 dark:border-stone-800 text-stone-400 font-bold uppercase text-[9px] tracking-wider">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Source</th>
                  <th className="pb-3">Phone</th>
                  <th className="pb-3">Logged Date</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Follow-Up Remind</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50 dark:divide-stone-800">
                {inquiries.map(inq => (
                  <tr key={inq.id} className="hover:bg-stone-50/50 dark:hover:bg-brand-dark-bg/40">
                    <td className="py-3 font-bold text-stone-900 dark:text-white">{inq.name}</td>
                    <td className="py-3">
                      <span className="bg-stone-100 dark:bg-brand-dark-bg px-2 py-0.5 rounded font-medium">{inq.source}</span>
                    </td>
                    <td className="py-3 font-mono">{inq.phone}</td>
                    <td className="py-3 text-stone-500">{inq.date}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        inq.status === "Joined" ? "bg-green-100 text-green-700" :
                        inq.status === "Trial" ? "bg-brand-primary/20 text-brand-primary" :
                        inq.status === "Interested" ? "bg-amber-100 text-amber-700" :
                        "bg-rose-100 text-rose-700"
                      }`}>
                        {inq.status}
                      </span>
                    </td>
                    <td className="py-3 text-amber-600 font-semibold">{inq.followUpDate}</td>
                    <td className="py-3 text-right">
                      <select
                        value={inq.status}
                        onChange={(e) => onUpdateInquiryStatus(inq.id, e.target.value as any)}
                        className="bg-transparent border border-stone-200 dark:border-stone-700 rounded px-1.5 py-0.5 text-[10px] outline-none"
                      >
                        <option value="Interested">Interested</option>
                        <option value="Trial">Trial Class</option>
                        <option value="Joined">Joined Mat</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      ) : (
        /* Business Reports module */
        <div className="space-y-6">
          
          {/* Periods selection */}
          <div className="flex justify-between items-center bg-white dark:bg-brand-dark-card p-4 rounded-xl border border-stone-100 dark:border-stone-800 shadow-sm">
            <div className="flex items-center gap-3">
              <BarChart2 className="w-5 h-5 text-brand-primary" />
              <div>
                <h4 className="font-bold text-sm text-stone-900 dark:text-white">Generate Operational Audit</h4>
                <p className="text-[10px] text-stone-500">Review class trends and revenue collections</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setReportPeriod("Daily")}
                className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all ${
                  reportPeriod === "Daily" ? "bg-brand-primary text-white" : "bg-stone-50 dark:bg-brand-dark-bg text-stone-600"
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => setReportPeriod("Weekly")}
                className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all ${
                  reportPeriod === "Weekly" ? "bg-brand-primary text-white" : "bg-stone-50 dark:bg-brand-dark-bg text-stone-600"
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setReportPeriod("Monthly")}
                className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all ${
                  reportPeriod === "Monthly" ? "bg-brand-primary text-white" : "bg-stone-50 dark:bg-brand-dark-bg text-stone-600"
                }`}
              >
                Monthly
              </button>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            <div className="bg-white dark:bg-brand-dark-card p-5 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 space-y-2">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Aggregate Revenue Collection</span>
              <h3 className="text-xl font-bold text-brand-primary">LKR {totalRevenue.toLocaleString()}</h3>
              <p className="text-[10px] text-stone-500">Gross studio earnings recorded in system database</p>
            </div>

            <div className="bg-white dark:bg-brand-dark-card p-5 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 space-y-2">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Aggregate Studio Expenses</span>
              <h3 className="text-xl font-bold text-rose-500">LKR {totalExpenses.toLocaleString()}</h3>
              <p className="text-[10px] text-stone-500">Rent, utilites, salaries, maintenance items</p>
            </div>

            <div className="bg-white dark:bg-brand-dark-card p-5 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 space-y-2">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Aggregate Calculated Profit</span>
              <h3 className={`text-xl font-bold ${netProfit >= 0 ? "text-emerald-600" : "text-rose-500"}`}>
                LKR {netProfit.toLocaleString()}
              </h3>
              <p className="text-[10px] text-stone-500">Studio net yield margins (gross minus expenditures)</p>
            </div>

          </div>

          {/* Detailed Lists Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Top Attendees */}
            <div className="bg-white dark:bg-brand-dark-card rounded-2xl p-5 shadow-sm border border-stone-100 dark:border-stone-800 space-y-3">
              <h4 className="font-bold text-xs text-stone-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-brand-primary" />
                Top Yoga Attendees
              </h4>
              <div className="divide-y divide-stone-50 dark:divide-stone-800">
                {topAttendees.map((att, index) => (
                  <div key={att.id} className="flex justify-between items-center py-2.5 text-xs">
                    <span className="font-semibold text-stone-700 dark:text-stone-300">
                      {index + 1}. {att.name}
                    </span>
                    <span className="font-bold text-brand-primary bg-brand-primary/5 px-2 py-0.5 rounded-full font-mono">
                      {att.count} classes Present
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Inactive students list */}
            <div className="bg-white dark:bg-brand-dark-card rounded-2xl p-5 shadow-sm border border-stone-100 dark:border-stone-800 space-y-3">
              <h4 className="font-bold text-xs text-stone-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-500" />
                Inactive Student Roster
              </h4>
              <div className="divide-y divide-stone-50 dark:divide-stone-800">
                {inactiveRoster.map(student => (
                  <div key={student.id} className="flex justify-between items-center py-2.5 text-xs">
                    <span className="font-semibold text-stone-700 dark:text-stone-300">{student.fullName}</span>
                    <span className="text-[10px] text-stone-400 font-mono">{student.id}</span>
                  </div>
                ))}
                {inactiveRoster.length === 0 && (
                  <div className="text-xs text-stone-400 text-center py-3">All registered students are active or paused.</div>
                )}
              </div>
            </div>

          </div>

          {/* Exporters and Downloads panel */}
          <div className="bg-stone-900 text-white p-5 rounded-2xl shadow-md border border-stone-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h4 className="font-bold text-sm tracking-wide">Export Operational Audit</h4>
              <p className="text-xs text-stone-400">Generate fully compiled datasets to share with studio accountant or Kumodya.</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => exportToCSV(payments, "Ayurva_Payments_Audit_July_2026")}
                className="bg-brand-primary hover:bg-brand-primary/95 text-xs font-bold px-3.5 py-2.5 rounded-xl flex items-center gap-1 transition-all text-white"
              >
                <FileSpreadsheet className="w-4 h-4 text-brand-accent" />
                Download Excel CSV
              </button>
              <button
                onClick={() => window.print()}
                className="bg-stone-800 hover:bg-stone-700 text-xs font-bold px-3.5 py-2.5 rounded-xl flex items-center gap-1 transition-all text-stone-300"
              >
                <Printer className="w-4 h-4" /> Print PDF Dossier
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Log Inquiry Modal */}
      {showInqModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-brand-dark-card rounded-2xl w-full max-w-sm p-6 shadow-2xl relative">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="font-bold text-sm text-stone-950 dark:text-white flex items-center gap-1">
                <Mail className="w-4 h-4 text-brand-primary" /> Log Social Query Lead
              </h3>
              <button onClick={() => setShowInqModal(false)} className="text-stone-400 hover:text-stone-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInquirySubmit} className="space-y-4 text-xs text-stone-700 dark:text-stone-300">
              <div>
                <label className="block mb-1 font-semibold text-stone-500">Contact Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Malkanthi Silva"
                  value={newInq.name}
                  onChange={(e) => setNewInq(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-semibold text-stone-500">Lead Source</label>
                  <select
                    value={newInq.source}
                    onChange={(e) => setNewInq(prev => ({ ...prev, source: e.target.value as any }))}
                    className="w-full bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  >
                    <option value="Facebook">Facebook</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Google">Google</option>
                    <option value="Website">Website</option>
                    <option value="Walk-in">Walk-in</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-semibold text-stone-500">Phone *</label>
                  <input
                    required
                    type="tel"
                    placeholder="e.g. +94 71 888 2323"
                    value={newInq.phone}
                    onChange={(e) => setNewInq(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 font-semibold text-stone-500">Follow-Up Date</label>
                <input
                  type="date"
                  value={newInq.followUpDate}
                  onChange={(e) => setNewInq(prev => ({ ...prev, followUpDate: e.target.value }))}
                  className="w-full bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-stone-500">Lead Inquiry Notes</label>
                <textarea
                  rows={2}
                  placeholder="Describe query context..."
                  value={newInq.notes}
                  onChange={(e) => setNewInq(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowInqModal(false)}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold px-4 py-2 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-brand-primary hover:bg-brand-primary/95 text-white font-bold px-5 py-2 rounded-xl transition-all shadow"
                >
                  Save Inquiry Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
