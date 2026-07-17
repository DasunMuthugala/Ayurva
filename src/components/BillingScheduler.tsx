import React, { useState } from "react";
import { 
  DollarSign, Clock, Tag, Printer, CheckCircle, 
  AlertCircle, ArrowUpRight, PlusCircle, CreditCard, Award, X,
  Search, ChevronDown, ChevronUp, User, Filter, AlertTriangle, FileText
} from "lucide-react";
import { Student, Payment, Membership } from "../types";

interface BillingSchedulerProps {
  students: Student[];
  payments: Payment[];
  memberships: Membership[];
  onAddPayment: (payment: Payment) => void;
  role: string;
}

export default function BillingScheduler({
  students,
  payments,
  memberships,
  onAddPayment,
  role
}: BillingSchedulerProps) {
  // Tab State
  const [billingTab, setBillingTab] = useState<"overview" | "studentLedger">("overview");

  // Student Ledger Filtering
  const [studentSearch, setStudentSearch] = useState("");
  const [outstandingFilter, setOutstandingFilter] = useState<"all" | "outstanding">("all");
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);

  // Payment creation form
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [payAmount, setPayAmount] = useState<number>(3500);
  const [payMethod, setPayMethod] = useState<"Cash" | "Card" | "Bank Transfer" | "Online Payment">("Cash");
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [membershipType, setMembershipType] = useState("Monthly Pass");
  const [invoiceNo, setInvoiceNo] = useState(`INV-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  // Selected Invoice for printing
  const [selectedInvoice, setSelectedInvoice] = useState<Payment | null>(null);

  const applyPromoCode = () => {
    if (discountCode.trim().toUpperCase() === "AYURVA10") {
      setDiscountAmount(payAmount * 0.1);
      alert("Promo Code AYURVA10 applied! 10% discount subtracted.");
    } else {
      alert("Invalid Code. Use AYURVA10 for a demo 10% discount.");
    }
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || payAmount <= 0) {
      alert("Please select a student and enter a valid payment amount.");
      return;
    }

    const student = students.find(s => s.id === selectedStudentId);
    if (!student) return;

    const finalPaid = payAmount - discountAmount;

    const newPayment: Payment = {
      id: `p-${Date.now()}`,
      studentId: student.id,
      studentName: student.fullName,
      amount: finalPaid,
      date: new Date().toISOString().split("T")[0],
      method: payMethod,
      status: "Paid",
      membershipType,
      discountCode: discountCode || undefined,
      discountAmount: discountAmount || undefined,
      outstandingBalance: 0,
      lateFee: 0,
      invoiceNo
    };

    onAddPayment(newPayment);
    alert(`Payment recorded successfully! Invoice generated: ${invoiceNo}`);
    
    // Auto-open receipt for printing!
    setSelectedInvoice(newPayment);

    // Reset Form
    setSelectedStudentId("");
    setPayAmount(3500);
    setMembershipType("Monthly Pass");
    setDiscountCode("");
    setDiscountAmount(0);
    setInvoiceNo(`INV-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  const toggleStudentExpand = (studentId: string) => {
    setExpandedStudentId(expandedStudentId === studentId ? null : studentId);
  };

  // Metrics calculations for the ledgers tab
  const studioTotalBilled = payments.reduce((sum, p) => sum + p.amount, 0);
  const studioTotalCollected = payments.filter(p => p.status === "Paid").reduce((sum, p) => sum + p.amount, 0);
  const studioTotalOutstanding = payments.filter(p => p.status === "Pending").reduce((sum, p) => sum + (p.outstandingBalance || 0), 0);
  const studentsWithDuesCount = students.filter(s => {
    const sPayments = payments.filter(p => p.studentId === s.id);
    const sOutstanding = sPayments.filter(p => p.status === "Pending").reduce((sum, p) => sum + (p.outstandingBalance || 0), 0);
    return sOutstanding > 0;
  }).length;

  return (
    <div className="space-y-6">
      
      {/* Tab Switcher & Billing Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-brand-dark-card p-5 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm gap-4">
        <div>
          <h3 className="font-bold text-lg text-stone-900 dark:text-white">Studio Billing & Revenue</h3>
          <p className="text-[11px] text-stone-500">Collect tuition fees, manage student memberships, and track payment histories.</p>
        </div>

        <div className="flex bg-stone-100 dark:bg-brand-dark-bg p-1 rounded-xl border border-stone-200/40 dark:border-stone-800 shrink-0">
          <button
            onClick={() => setBillingTab("overview")}
            className={`text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              billingTab === "overview" 
                ? "bg-white dark:bg-brand-dark-card shadow text-brand-primary" 
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            Collect & Recent Payments
          </button>
          <button
            onClick={() => setBillingTab("studentLedger")}
            className={`text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              billingTab === "studentLedger" 
                ? "bg-white dark:bg-brand-dark-card shadow text-brand-primary" 
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            Student Payment Ledgers
          </button>
        </div>
      </div>

      {/* 1. OVERVIEW TAB: Record Payment Form & Recent Transaction list */}
      {billingTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Payment logger Form - Span 1 */}
          <div className="bg-white dark:bg-brand-dark-card rounded-2xl p-5 shadow-sm border border-stone-100 dark:border-stone-800 space-y-4 text-xs">
            <h4 className="font-bold text-sm text-stone-800 dark:text-white flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-brand-primary" />
              Collect Member Fees
            </h4>

            <form onSubmit={handleRecordPayment} className="space-y-3.5 text-stone-700 dark:text-stone-300">
              <div>
                <label className="block mb-1 font-semibold text-stone-500">Student Profile *</label>
                <select
                  required
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-primary text-stone-800 dark:text-white"
                >
                  <option value="">Select Enrolled Student...</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.fullName} ({s.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-semibold text-stone-500">Yoga Package / Membership</label>
                <select
                  value={membershipType}
                  onChange={(e) => {
                    const val = e.target.value;
                    setMembershipType(val);
                    if (val === "Drop-in Pass") setPayAmount(1500);
                    else if (val === "Monthly Pass") setPayAmount(3500);
                    else if (val === "Private Session") setPayAmount(4000);
                  }}
                  className="w-full bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-primary text-stone-800 dark:text-white"
                >
                  <option value="Drop-in Pass">Drop-in Pass (LKR 1,500)</option>
                  <option value="Monthly Pass">Monthly Pass (LKR 3,500)</option>
                  <option value="Private Session">Private Session (LKR 4,000)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-semibold text-stone-500">Amount (LKR)</label>
                  <input
                    required
                    type="number"
                    value={payAmount || ""}
                    onChange={(e) => setPayAmount(Number(e.target.value))}
                    className="w-full bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-primary text-stone-800 dark:text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold text-stone-500">Pay Method</label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value as any)}
                    className="w-full bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-primary text-stone-800 dark:text-white font-semibold"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Card">Card Terminal</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Online Payment">Online Portal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1 font-semibold text-stone-500">Promo Discount Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. AYURVA10"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="w-full bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-primary text-stone-800 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={applyPromoCode}
                    className="bg-stone-100 dark:bg-brand-dark-bg hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold px-3 rounded-xl border border-stone-200 dark:border-stone-700"
                  >
                    Apply
                  </button>
                </div>
                {discountAmount > 0 && (
                  <div className="text-[10px] text-green-600 font-bold mt-1">LKR {discountAmount} discount applied!</div>
                )}
              </div>

              <div className="pt-2">
                <div className="bg-brand-bg dark:bg-brand-dark-bg p-3 rounded-xl border border-stone-100 dark:border-stone-850 space-y-1 mt-1 font-mono text-[10px] text-stone-500">
                  <div className="flex justify-between">
                    <span>Base Fare:</span>
                    <span>LKR {payAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span>- LKR {discountAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-brand-primary font-bold border-t pt-1 mt-1 text-xs">
                    <span>Net Total:</span>
                    <span>LKR {(payAmount - discountAmount).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-primary hover:bg-brand-primary/95 text-white font-bold py-3 rounded-xl shadow transition-all"
              >
                Accept Payment & Print Receipt
              </button>

            </form>
          </div>

          {/* Payment History List - Span 2 */}
          <div className="lg:col-span-2 bg-white dark:bg-brand-dark-card rounded-2xl p-5 shadow-sm border border-stone-100 dark:border-stone-800 space-y-4">
            <h4 className="font-bold text-sm text-stone-800 dark:text-white flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand-primary" />
              Recent Studio Income Transactions
            </h4>

            <div className="divide-y divide-stone-50 dark:divide-stone-800 max-h-[460px] overflow-y-auto">
              {payments.map(payment => (
                <div key={payment.id} className="flex justify-between items-center py-3 text-xs">
                  <div>
                    <div className="font-bold text-stone-900 dark:text-white">{payment.studentName}</div>
                    <div className="text-[10px] text-stone-400 font-mono mt-0.5">{payment.invoiceNo} • {payment.date}</div>
                    <div className="text-[10px] text-brand-primary font-bold bg-brand-primary/5 px-2 py-0.5 rounded-full inline-block mt-1">
                      {payment.membershipType}
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="font-bold text-stone-900 dark:text-white">LKR {payment.amount.toLocaleString()}</div>
                    <div className="flex items-center gap-1.5 justify-end">
                      <span className="text-[10px] text-stone-500 bg-stone-100 dark:bg-brand-dark-bg px-2 py-0.5 rounded">{payment.method}</span>
                      <button
                        onClick={() => setSelectedInvoice(payment)}
                        className="p-1 hover:bg-stone-50 dark:hover:bg-brand-dark-bg text-brand-primary hover:text-brand-primary/80"
                        title="Print Receipt Invoice"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 2. STUDENT PAYMENT LEDGERS TAB */}
      {billingTab === "studentLedger" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Financial Overview Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="bg-white dark:bg-brand-dark-card p-4 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm">
              <span className="text-[10px] font-bold text-stone-400 uppercase">Total Billings</span>
              <div className="text-xl font-black text-stone-900 dark:text-white mt-1">
                LKR {studioTotalBilled.toLocaleString()}
              </div>
              <p className="text-[9px] text-stone-500 mt-1">All invoices recorded</p>
            </div>

            <div className="bg-white dark:bg-brand-dark-card p-4 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm">
              <span className="text-[10px] font-bold text-stone-400 uppercase">Collected Revenue</span>
              <div className="text-xl font-black text-emerald-600 mt-1">
                LKR {studioTotalCollected.toLocaleString()}
              </div>
              <p className="text-[9px] text-stone-500 mt-1">Cleared paid transactions</p>
            </div>

            <div className="bg-white dark:bg-brand-dark-card p-4 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm">
              <span className="text-[10px] font-bold text-stone-400 uppercase">Outstanding Dues</span>
              <div className="text-xl font-black text-rose-500 mt-1">
                LKR {studioTotalOutstanding.toLocaleString()}
              </div>
              <p className="text-[9px] text-stone-500 mt-1">Awaiting client payment</p>
            </div>

            <div className="bg-white dark:bg-brand-dark-card p-4 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm">
              <span className="text-[10px] font-bold text-stone-400 uppercase">Unpaid Accounts</span>
              <div className="text-xl font-black text-amber-500 mt-1">
                {studentsWithDuesCount} {studentsWithDuesCount === 1 ? "Student" : "Students"}
              </div>
              <p className="text-[9px] text-stone-500 mt-1">With active pending invoices</p>
            </div>

          </div>

          {/* Interactive Search & Filtering */}
          <div className="bg-white dark:bg-brand-dark-card p-5 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row gap-4 justify-between items-center text-xs">
            
            <div className="relative w-full sm:max-w-md">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search student ledger by name or ID..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-primary text-stone-800 dark:text-white"
              />
            </div>

            <div className="flex bg-stone-100 dark:bg-brand-dark-bg p-1 rounded-xl border border-stone-200/40 dark:border-stone-800 shrink-0">
              <button
                onClick={() => setOutstandingFilter("all")}
                className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all ${
                  outstandingFilter === "all" 
                    ? "bg-white dark:bg-brand-dark-card shadow text-brand-primary" 
                    : "text-stone-500 hover:text-stone-700"
                }`}
              >
                All Students
              </button>
              <button
                onClick={() => setOutstandingFilter("outstanding")}
                className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                  outstandingFilter === "outstanding" 
                    ? "bg-white dark:bg-brand-dark-card shadow text-rose-500" 
                    : "text-stone-500 hover:text-stone-700"
                }`}
              >
                <AlertCircle className="w-3 h-3" />
                With Dues Only
              </button>
            </div>

          </div>

          {/* Student Ledgers List */}
          <div className="bg-white dark:bg-brand-dark-card rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-50 dark:bg-brand-dark-bg/50 border-b border-stone-100 dark:border-stone-800 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-5">Student</th>
                    <th className="py-3 px-4">Membership Package</th>
                    <th className="py-3 px-4 text-right">Transactions</th>
                    <th className="py-3 px-4 text-right">Total Paid</th>
                    <th className="py-3 px-4 text-right">Outstanding</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800/80">
                  {students.filter(s => {
                    const studentPayments = payments.filter(p => p.studentId === s.id);
                    const totalOutstanding = studentPayments
                      .filter(p => p.status === "Pending")
                      .reduce((sum, p) => sum + p.outstandingBalance, 0);

                    const matchesSearch = s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
                                          s.id.toLowerCase().includes(studentSearch.toLowerCase());
                    const matchesOutstanding = outstandingFilter === "all" || totalOutstanding > 0;

                    return matchesSearch && matchesOutstanding;
                  }).map(student => {
                    const studentPayments = payments.filter(p => p.studentId === student.id);
                    
                    const totalPaid = studentPayments
                      .filter(p => p.status === "Paid")
                      .reduce((sum, p) => sum + p.amount, 0);
                    
                    const totalOutstanding = studentPayments
                      .filter(p => p.status === "Pending")
                      .reduce((sum, p) => sum + p.outstandingBalance, 0);

                    const isExpanded = expandedStudentId === student.id;

                    // Get membership name
                    const membershipName = student.className || "Drop-in Pass";

                    return (
                      <React.Fragment key={student.id}>
                        {/* Main Student Row */}
                        <tr className={`hover:bg-stone-50/50 dark:hover:bg-brand-dark-bg/20 transition-all ${isExpanded ? "bg-stone-50/30 dark:bg-brand-dark-bg/10" : ""}`}>
                          
                          {/* Student Info */}
                          <td className="py-3.5 px-5">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={student.photoUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150"}
                                alt={student.fullName}
                                className="w-8 h-8 rounded-full object-cover border border-stone-100 dark:border-stone-800"
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <div className="font-bold text-stone-900 dark:text-white">{student.fullName}</div>
                                <div className="text-[10px] text-stone-400 font-mono">ID: {student.id}</div>
                              </div>
                            </div>
                          </td>

                          {/* Membership Package */}
                          <td className="py-3.5 px-4 font-semibold text-stone-700 dark:text-stone-300">
                            <span className="text-[10px] text-brand-primary font-bold bg-brand-primary/5 px-2 py-0.5 rounded">
                              {membershipName}
                            </span>
                          </td>

                          {/* Payment Records Count */}
                          <td className="py-3.5 px-4 text-right font-semibold text-stone-800 dark:text-white">
                            {studentPayments.length} {studentPayments.length === 1 ? "invoice" : "invoices"}
                          </td>

                          {/* Total Paid */}
                          <td className="py-3.5 px-4 text-right font-black text-emerald-600">
                            LKR {totalPaid.toLocaleString()}
                          </td>

                          {/* Outstanding Balance */}
                          <td className="py-3.5 px-4 text-right font-black">
                            {totalOutstanding > 0 ? (
                              <span className="text-rose-600 bg-rose-50 dark:bg-rose-950/20 px-2 py-0.5 rounded font-bold text-[11px] animate-pulse">
                                LKR {totalOutstanding.toLocaleString()}
                              </span>
                            ) : (
                              <span className="text-stone-400 text-[10px] font-normal">No dues</span>
                            )}
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3.5 px-4 text-right font-semibold">
                            <div className="flex justify-end items-center gap-2">
                              <button
                                onClick={() => toggleStudentExpand(student.id)}
                                className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-brand-dark-bg text-stone-600 dark:text-stone-300 flex items-center gap-1 transition-all"
                              >
                                {isExpanded ? (
                                  <>
                                    Hide Details <ChevronUp className="w-3.5 h-3.5" />
                                  </>
                                ) : (
                                  <>
                                    View History <ChevronDown className="w-3.5 h-3.5" />
                                  </>
                                )}
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedStudentId(student.id);
                                  // Prepopulate values based on student dues or membership defaults
                                  if (totalOutstanding > 0) {
                                    setPayAmount(totalOutstanding);
                                  } else {
                                    setPayAmount(3500);
                                  }
                                  setBillingTab("overview");
                                }}
                                className="text-[10px] font-bold bg-brand-primary hover:bg-brand-primary/95 text-white px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all"
                              >
                                <PlusCircle className="w-3 h-3" /> Collect
                              </button>
                            </div>
                          </td>

                        </tr>

                        {/* Expanded Payment History Details */}
                        {isExpanded && (
                          <tr>
                            <td colSpan={6} className="bg-stone-50/50 dark:bg-brand-dark-bg/20 p-5 border-t border-b border-stone-100 dark:border-stone-800">
                              <div className="space-y-3">
                                <div className="flex justify-between items-center border-b border-stone-200/50 dark:border-stone-800 pb-2">
                                  <h5 className="font-bold text-xs text-brand-primary flex items-center gap-1.5">
                                    <FileText className="w-4 h-4" />
                                    Transaction Ledger for {student.fullName}
                                  </h5>
                                  <span className="text-[10px] text-stone-400">
                                    Showing all historical logs
                                  </span>
                                </div>

                                {studentPayments.length === 0 ? (
                                  <div className="text-center py-6 text-stone-500 text-xs">
                                    <AlertCircle className="w-6 h-6 text-stone-300 mx-auto mb-1.5" />
                                    No transaction logs exist for this student yet. Click "Collect" to register their first pass!
                                  </div>
                                ) : (
                                  <div className="overflow-hidden rounded-xl border border-stone-200/60 dark:border-stone-800 bg-white dark:bg-brand-dark-card shadow-inner">
                                    <table className="w-full text-left text-xs border-collapse">
                                      <thead>
                                        <tr className="bg-stone-50 dark:bg-brand-dark-bg/30 text-stone-500 font-bold text-[9px] uppercase tracking-wider border-b border-stone-200/40 dark:border-stone-800">
                                          <th className="py-2.5 px-4">Invoice No</th>
                                          <th className="py-2.5 px-4">Date</th>
                                          <th className="py-2.5 px-4">Membership Class</th>
                                          <th className="py-2.5 px-4">Pay Method</th>
                                          <th className="py-2.5 px-4">Status</th>
                                          <th className="py-2.5 px-4 text-right">Amount</th>
                                          <th className="py-2.5 px-4 text-right">Print</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-stone-100 dark:divide-stone-800/50 text-[11px]">
                                        {studentPayments.map(p => (
                                          <tr key={p.id} className="hover:bg-stone-50 dark:hover:bg-brand-dark-bg/20 transition-all">
                                            <td className="py-2 px-4 font-bold text-brand-primary font-mono">{p.invoiceNo}</td>
                                            <td className="py-2 px-4 text-stone-500">{p.date}</td>
                                            <td className="py-2 px-4 font-semibold text-stone-700 dark:text-stone-300">{p.membershipType}</td>
                                            <td className="py-2 px-4 text-stone-500">{p.method}</td>
                                            <td className="py-2 px-4">
                                              <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                                                p.status === "Paid" 
                                                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400" 
                                                  : p.status === "Pending"
                                                    ? "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                                                    : "bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400"
                                              }`}>
                                                {p.status}
                                              </span>
                                            </td>
                                            <td className="py-2 px-4 text-right font-bold text-stone-900 dark:text-white">
                                              LKR {p.amount.toLocaleString()}
                                            </td>
                                            <td className="py-2 px-4 text-right">
                                              <button
                                                onClick={() => setSelectedInvoice(p)}
                                                className="p-1 hover:bg-stone-100 dark:hover:bg-brand-dark-bg rounded text-brand-primary transition-all"
                                                title="Print Invoice"
                                              >
                                                <Printer className="w-3.5 h-3.5" />
                                              </button>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}

                  {students.filter(s => {
                    const studentPayments = payments.filter(p => p.studentId === s.id);
                    const totalOutstanding = studentPayments
                      .filter(p => p.status === "Pending")
                      .reduce((sum, p) => sum + p.outstandingBalance, 0);

                    const matchesSearch = s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
                                          s.id.toLowerCase().includes(studentSearch.toLowerCase());
                    const matchesOutstanding = outstandingFilter === "all" || totalOutstanding > 0;

                    return matchesSearch && matchesOutstanding;
                  }).length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-stone-500">
                        <AlertCircle className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                        <p className="text-xs font-semibold">No students found matching current filters.</p>
                        <p className="text-[10px] text-stone-400 font-normal">Adjust search query or filter settings.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Elegant Invoice Receipt Modal for Printing */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-950 rounded-2xl w-full max-w-sm p-6 shadow-2xl relative border-t-8 border-brand-primary">
            
            {/* Close */}
            <button 
              onClick={() => setSelectedInvoice(null)}
              className="absolute right-4 top-4 text-stone-400 hover:text-stone-600 print:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Print Area */}
            <div className="space-y-4 font-sans text-xs text-stone-800 dark:text-stone-100" id="receipt-print-area">
              
              {/* Studio Logo Header */}
              <div className="text-center space-y-1">
                <Award className="w-8 h-8 text-brand-primary mx-auto" />
                <h2 className="font-bold text-sm tracking-wide text-brand-primary">AYURVA YOGA & WELLNESS</h2>
                <p className="text-[9px] text-stone-400 leading-normal">by Kumodya Dilshani • Colombo 07, SL</p>
                <p className="text-[9px] text-stone-400 leading-normal">Phone: +94 11 234 5678</p>
              </div>

              <div className="border-t border-dashed border-stone-200 py-3 space-y-1.5 text-[10px] text-stone-500">
                <div className="flex justify-between">
                  <span>Invoice No:</span>
                  <span className="font-bold text-stone-800 dark:text-white font-mono">{selectedInvoice.invoiceNo}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-bold text-stone-800 dark:text-white">{selectedInvoice.date}</span>
                </div>
                <div className="flex justify-between">
                  <span>Student ID:</span>
                  <span className="font-bold text-stone-800 dark:text-white font-mono">{selectedInvoice.studentId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Student Name:</span>
                  <span className="font-bold text-stone-800 dark:text-white">{selectedInvoice.studentName}</span>
                </div>
              </div>

              <div className="border-t border-b border-dashed border-stone-200 py-3 space-y-1.5">
                <div className="flex justify-between font-bold text-stone-950 dark:text-white">
                  <span>Membership Details</span>
                  <span>Price</span>
                </div>
                <div className="flex justify-between text-stone-500 text-[10px]">
                  <span>{selectedInvoice.membershipType}</span>
                  <span>LKR {selectedInvoice.amount.toLocaleString()}</span>
                </div>
                {selectedInvoice.discountAmount && (
                  <div className="flex justify-between text-green-600 text-[10px]">
                    <span>Discount applied ({selectedInvoice.discountCode || "AYURVA10"})</span>
                    <span>- LKR {selectedInvoice.discountAmount.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between font-bold text-sm text-brand-primary">
                <span>Total Amount Paid:</span>
                <span>LKR {selectedInvoice.amount.toLocaleString()}</span>
              </div>

              <div className="text-center pt-3 border-t border-dashed border-stone-200 space-y-1 text-stone-400 text-[9px]">
                <p className="font-semibold text-brand-primary">Thank you for breathing with us.</p>
                <p>May your yoga journey bring you peace and vitality.</p>
                <p className="font-mono text-[8px] mt-2">Powered by AI Studio Systems</p>
              </div>

            </div>

            {/* Print trigger */}
            <div className="mt-5 flex gap-2 print:hidden">
              <button
                onClick={() => window.print()}
                className="w-full bg-brand-primary text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1 hover:bg-brand-primary/95 transition-all shadow-sm"
              >
                <Printer className="w-4 h-4" /> Print Real Receipt
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
