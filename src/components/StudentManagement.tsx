import React, { useState } from "react";
import { 
  Search, Plus, User, FileText, Heart, Activity, 
  Brain, Lock, Sparkles, RefreshCw, Phone, MapPin, 
  Trash, Upload, ChevronRight, X, AlertCircle, Eye, EyeOff
} from "lucide-react";
import { Student, StudentMedicalHistory, StudentHealthAssessment, BodyMeasurements, ClassSchedule } from "../types";

interface StudentManagementProps {
  students: Student[];
  classes: ClassSchedule[];
  onAddStudent: (student: Student) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  role: string;
  t: any;
}

export default function StudentManagement({
  students,
  classes,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  role,
  t
}: StudentManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [genderFilter, setGenderFilter] = useState("All");
  const [cityFilter, setCityFilter] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  // Registration Form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Student>>({
    fullName: "",
    gender: "Female",
    dateOfBirth: "",
    age: 25,
    nicOrPassport: "",
    occupation: "",
    address: "",
    city: "",
    district: "Gampaha",
    phone: "",
    whatsApp: "",
    email: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
    yogaExperience: "None",
    goals: "",
    notes: "",
    privateNotes: ""
  });

  // Medical form separate states
  const [medicalConditions, setMedicalConditions] = useState<StudentMedicalHistory>({
    bloodPressure: "Normal",
    diabetes: false,
    heartProblems: false,
    backPain: false,
    pregnancy: false,
    surgeries: "",
    injuries: "",
    medications: "",
    doctorNotes: ""
  });

  const [assessment, setAssessment] = useState<StudentHealthAssessment>({
    lifestyle: "",
    stressLevel: "Moderate",
    sleepQuality: "Normal",
    waterIntake: "Normal",
    exerciseFrequency: "Sometimes",
    diet: "",
    smoking: false,
    alcohol: false,
    painAreas: [],
    fitnessLevel: 5,
    flexibilityScore: 5,
    breathingScore: 5,
    balanceScore: 5,
    meditationExperience: "None",
    healthRisks: [],
    recommendations: ""
  });

  const [measurements, setMeasurements] = useState<BodyMeasurements>({
    weight: 60,
    height: 165,
    bmi: 22.0,
    chest: 34,
    waist: 28,
    hips: 36
  });

  // AI Recommendations state
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiError, setAiError] = useState("");

  const calculateBMI = (w: number, h: number) => {
    if (!w || !h) return 22.0;
    const heightInMeters = h / 100;
    return Number((w / (heightInMeters * heightInMeters)).toFixed(1));
  };

  const handleWeightChange = (val: number) => {
    const bmi = calculateBMI(val, measurements.height);
    setMeasurements(prev => ({ ...prev, weight: val, bmi }));
  };

  const handleHeightChange = (val: number) => {
    const bmi = calculateBMI(measurements.weight, val);
    setMeasurements(prev => ({ ...prev, height: val, bmi }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      alert("Please fill out Name and Phone number");
      return;
    }

    const calculatedAge = formData.dateOfBirth 
      ? new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear()
      : 25;

    const selectedClass = classes.find(c => c.id === formData.classId) || (classes.length > 0 ? classes[0] : undefined);

    const newStudent: Student = {
      id: `AYUR-2026-0${students.length + 1}`,
      qrCodeUrl: `AYUR-2026-0${students.length + 1}`,
      photoUrl: formData.gender === "Male" 
        ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
        : "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
      fullName: formData.fullName || "",
      gender: formData.gender as "Male" | "Female" | "Other" || "Female",
      dateOfBirth: formData.dateOfBirth || "1999-01-01",
      age: calculatedAge,
      nicOrPassport: formData.nicOrPassport || "",
      occupation: formData.occupation || "",
      address: formData.address || "",
      city: formData.city || "",
      district: formData.district || "Gampaha",
      phone: formData.phone || "",
      whatsApp: formData.whatsApp || "",
      email: formData.email || "",
      emergencyContactName: formData.emergencyContactName || "",
      emergencyContactPhone: formData.emergencyContactPhone || "",
      emergencyContactRelation: formData.emergencyContactRelation || "Relative",
      classId: selectedClass?.id || "",
      className: selectedClass?.name || "Not Linked",
      medicalConditions: { ...medicalConditions },
      yogaExperience: formData.yogaExperience as any || "None",
      goals: formData.goals || "",
      assessment: { ...assessment },
      measurements: { ...measurements },
      status: "Active",
      registrationDate: new Date().toISOString().split("T")[0],
      membershipType: "Monthly Pass",
      notes: formData.notes || "",
      privateNotes: formData.privateNotes || "",
      documents: []
    };

    onAddStudent(newStudent);
    setShowAddModal(false);
    // Reset Form
    setFormData({});
    setMedicalConditions({
      bloodPressure: "Normal", diabetes: false, heartProblems: false, backPain: false, pregnancy: false,
      surgeries: "", injuries: "", medications: "", doctorNotes: ""
    });
  };

  const getAiAnalysis = async (student: Student) => {
    setLoadingAi(true);
    setAiError("");
    setAiAnalysis(null);
    try {
      const res = await fetch("/api/gemini/student-ai-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAiAnalysis(data);
    } catch (err: any) {
      console.error(err);
      setAiError("Failed to reach Ayurva AI server. Providing simulated wellness plan for this profile...");
      
      // Fallback response for offline sandbox
      setTimeout(() => {
        setAiAnalysis({
          healthSummary: `${student.fullName} presents with ${student.medicalConditions.backPain ? "chronic back pain concerns" : "high stress and muscular tightness"}. Core strength is adequate, but flexibility is restricted.`,
          recommendations: {
            asanas: student.medicalConditions.backPain 
              ? ["Supported Child's Pose (Balasana) with block", "Cat-Cow Stretch (Marjaryasana)", "Gentle Bridge Pose (Setu Bandha)"]
              : ["Extended Triangle Pose (Trikonasana)", "Tree Pose (Vrikshasana)", "Seated Forward Bend with strap"],
            pranayama: student.medicalConditions.bloodPressure === "High"
              ? ["Sheetali Pranayama (Cooling Breath) - 5 mins", "Nadi Shodhana (Alternate Nostril) - 10 mins"]
              : ["Nadi Shodhana (Alternate Nostril) - 10 mins", "Bhramari Pranayama (Humming Bee)"],
            meditation: "10 minutes of Mindfulness Breath-Counting (Anapanasati) to downregulate autonomic arousal.",
            cautions: student.medicalConditions.backPain 
              ? ["Strictly avoid extreme deep seated forward folds", "Do not hold deep backbends without blocks under sacrum"]
              : ["No cautions, proceed with balanced caution during standing splits"]
          },
          predictions: {
            dropoutRisk: student.assessment.stressLevel === "High" ? "Medium" : "Low",
            riskPercentage: student.assessment.stressLevel === "High" ? 45 : 15,
            riskFactors: student.assessment.stressLevel === "High" 
              ? ["High work stress might cause schedule collision", "Workplace exhaustion limits early morning attendance"]
              : ["None, student displays healthy intrinsic motivation"],
            engagementAction: "Offer a weekend workshop option or send a gentle follow-up check-in text if they miss 2 sessions."
          },
          reminderSuggestions: {
            paymentReminder: `Namaste ${student.fullName}, we hope you're feeling revitalized after our recent Spine Care classes. Just a gentle note that your Ayurva membership is due for renewal. We look forward to breathing with you on the mat again soon! 🙏✨`
          }
        });
      }, 1000);
    } finally {
      setLoadingAi(false);
    }
  };

  // Filter students
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.phone.includes(searchQuery) || 
      s.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || s.status === statusFilter;
    const matchesGender = genderFilter === "All" || s.gender === genderFilter;
    const matchesDistrict = cityFilter === "All" || s.district === cityFilter;

    return matchesSearch && matchesStatus && matchesGender && matchesDistrict;
  });

  return (
    <div className="space-y-6">
      
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white dark:bg-brand-dark-card p-4 rounded-xl border border-stone-100 dark:border-stone-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search students by Name, ID, Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-brand-primary"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Paused">Paused</option>
          </select>

          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="text-xs bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-brand-primary"
          >
            <option value="All">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="text-xs bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-brand-primary"
          >
            <option value="All">All Cities</option>
            <option value="Mirigama">Mirigama</option>
            <option value="Minuwangoda">Minuwangoda</option>
            <option value="Gampaha">Gampaha</option>
            <option value="Miriswatta">Miriswatta</option>
          </select>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-brand-primary hover:bg-brand-primary/95 text-white text-xs font-semibold px-3 py-2.5 rounded-xl shrink-0 flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Register Student
          </button>
        </div>
      </div>

      {/* Student List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStudents.length > 0 ? (
          filteredStudents.map(student => (
            <div 
              key={student.id}
              onClick={() => setSelectedStudent(student)}
              className="bg-white dark:bg-brand-dark-card rounded-2xl p-5 shadow-sm border border-stone-100 dark:border-stone-800 hover:border-brand-primary/40 cursor-pointer transition-all hover:shadow-md flex items-start gap-4"
            >
              <img
                src={student.photoUrl}
                alt={student.fullName}
                className="w-14 h-14 rounded-full object-cover shrink-0 border-2 border-stone-100 dark:border-stone-800"
              />
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex justify-between items-start gap-1">
                  <h3 className="text-sm font-bold text-stone-900 dark:text-white truncate">{student.fullName}</h3>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0 ${
                    student.status === "Active" ? "bg-green-100 text-green-700" :
                    student.status === "Paused" ? "bg-amber-100 text-amber-700" :
                    "bg-stone-100 text-stone-600"
                  }`}>
                    {student.status}
                  </span>
                </div>
                <div className="text-[10px] text-stone-500 dark:text-stone-400 font-mono">{student.id}</div>
                <div className="text-xs text-stone-700 dark:text-stone-300 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-stone-400" />
                  {student.phone}
                </div>
                <div className="text-xs text-stone-600 dark:text-stone-400 flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 text-stone-400" />
                  {student.city}, {student.district}
                </div>
                <div className="text-[10px] text-brand-primary dark:text-brand-primary font-bold bg-brand-primary/10 px-2 py-0.5 rounded-md inline-block mt-1">
                  Class: {student.className || "Not Linked"}
                </div>

                {/* Micro indicators */}
                <div className="flex gap-2 pt-2 text-[10px] text-stone-500 dark:text-stone-400 border-t border-stone-50 dark:border-stone-800/80 mt-2">
                  <span className="flex items-center gap-0.5 font-semibold">
                    <Activity className="w-3 h-3 text-brand-primary" /> BMI {student.measurements.bmi}
                  </span>
                  {student.medicalConditions.backPain && (
                    <span className="text-amber-600 font-bold bg-amber-50 dark:bg-amber-950/20 px-1 rounded">Back Pain</span>
                  )}
                  {student.medicalConditions.pregnancy && (
                    <span className="text-rose-500 font-bold bg-rose-50 dark:bg-rose-950/20 px-1 rounded">Prenatal</span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white dark:bg-brand-dark-card rounded-2xl p-8 text-center text-stone-500 border border-stone-100 dark:border-stone-800">
            No students found matching current search or filters.
          </div>
        )}
      </div>

      {/* Student Profile Dossier Drawer/Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex justify-end transition-all">
          <div className="w-full max-w-2xl bg-brand-bg dark:bg-brand-dark-bg h-full overflow-y-auto flex flex-col shadow-2xl relative">
            
            {/* Header bar */}
            <div className="bg-white dark:bg-brand-dark-card p-5 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <img
                  src={selectedStudent.photoUrl}
                  alt={selectedStudent.fullName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-base font-bold text-stone-900 dark:text-white leading-tight">{selectedStudent.fullName}</h2>
                  <div className="text-xs text-stone-500 flex items-center gap-2 font-mono mt-0.5">
                    <span>{selectedStudent.id}</span>
                    <span>•</span>
                    <span className="font-semibold text-brand-primary uppercase">{selectedStudent.status}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {role === "Admin" && (
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete ${selectedStudent.fullName}?`)) {
                        onDeleteStudent(selectedStudent.id);
                        setSelectedStudent(null);
                      }
                    }}
                    className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                    title="Delete Student"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => {
                    setSelectedStudent(null);
                    setAiAnalysis(null);
                  }}
                  className="p-2 hover:bg-stone-100 dark:hover:bg-brand-dark-card rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-stone-500" />
                </button>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-6 space-y-6 flex-1">
              
              {/* Grid 1: Basic Info and QR Pass */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Personal Card */}
                <div className="bg-white dark:bg-brand-dark-card p-5 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 space-y-3 text-xs">
                  <h4 className="font-bold text-stone-800 dark:text-white border-b pb-1.5 border-stone-100 dark:border-stone-800">Student Details</h4>
                  
                  <div className="grid grid-cols-2 gap-y-2">
                    <span className="text-stone-400">Gender / Age:</span>
                    <span className="font-semibold text-stone-800 dark:text-white">{selectedStudent.gender} / {selectedStudent.age} yrs</span>
                    
                    <span className="text-stone-400">NIC / Passport:</span>
                    <span className="font-semibold text-stone-800 dark:text-white">{selectedStudent.nicOrPassport || "N/A"}</span>

                    <span className="text-stone-400">Phone:</span>
                    <span className="font-semibold text-stone-800 dark:text-white">{selectedStudent.phone}</span>

                    <span className="text-stone-400">WhatsApp:</span>
                    <a href={`https://wa.me/${selectedStudent.whatsApp.replace(/\D/g, '')}`} target="_blank" className="font-semibold text-brand-primary underline hover:text-brand-primary/80">
                      {selectedStudent.whatsApp}
                    </a>

                    <span className="text-stone-400">Email:</span>
                    <span className="font-semibold text-stone-800 dark:text-white truncate">{selectedStudent.email || "N/A"}</span>

                    <span className="text-stone-400">Address:</span>
                    <span className="font-semibold text-stone-800 dark:text-white">{selectedStudent.address}, {selectedStudent.city}, {selectedStudent.district}</span>

                    <span className="text-brand-primary font-bold">Linked Class:</span>
                    <span className="font-bold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded text-[11px] w-fit">
                      {selectedStudent.className || "Not Linked"}
                    </span>
                  </div>
                </div>

                {/* QR Membership Card */}
                <div className="bg-white dark:bg-brand-dark-card p-5 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="bg-brand-primary/5 p-4 rounded-xl border border-brand-primary/10">
                    {/* Simulated QR Code using stylized SVG */}
                    <svg className="w-24 h-24 text-stone-800 dark:text-white" viewBox="0 0 100 100" fill="currentColor">
                      <rect width="100" height="100" fill="white" />
                      {/* Corner squares */}
                      <rect x="5" y="5" width="25" height="25" fill="#0D4F51" />
                      <rect x="10" y="10" width="15" height="15" fill="white" />
                      <rect x="12" y="12" width="11" height="11" fill="#0D4F51" />

                      <rect x="70" y="5" width="25" height="25" fill="#0D4F51" />
                      <rect x="75" y="10" width="15" height="15" fill="white" />
                      <rect x="77" y="12" width="11" height="11" fill="#0D4F51" />

                      <rect x="5" y="70" width="25" height="25" fill="#0D4F51" />
                      <rect x="10" y="75" width="15" height="15" fill="white" />
                      <rect x="12" y="77" width="11" height="11" fill="#0D4F51" />

                      {/* Random digital noise */}
                      <rect x="40" y="10" width="5" height="15" fill="#0D4F51" />
                      <rect x="50" y="5" width="10" height="5" fill="#0D4F51" />
                      <rect x="55" y="20" width="5" height="15" fill="#0D4F51" />
                      <rect x="40" y="40" width="20" height="20" fill="#0D4F51" />
                      <rect x="45" y="45" width="10" height="10" fill="white" />
                      <rect x="15" y="45" width="10" height="5" fill="#0D4F51" />
                      <rect x="40" y="75" width="15" height="10" fill="#0D4F51" />
                      <rect x="75" y="40" width="10" height="20" fill="#0D4F51" />
                      <rect x="80" y="80" width="15" height="15" fill="#0D4F51" />
                      <rect x="60" y="80" width="5" height="5" fill="#0D4F51" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-xs text-stone-800 dark:text-white">Ayurva Digital Pass</div>
                    <div className="text-[10px] text-stone-500 font-mono mt-0.5">ID: {selectedStudent.id}</div>
                  </div>
                  <button 
                    onClick={() => alert(`Printing QR Card Pass for ${selectedStudent.fullName}`)}
                    className="text-[10px] text-brand-primary font-bold border border-brand-primary/20 hover:bg-brand-primary/5 px-2.5 py-1 rounded transition-all"
                  >
                    Print ID Card
                  </button>
                </div>

              </div>

              {/* Grid 2: Medical Conditions & Body Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                
                {/* Medical History */}
                <div className="bg-white dark:bg-brand-dark-card p-5 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 space-y-2.5">
                  <h4 className="font-bold text-stone-800 dark:text-white flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-rose-500 shrink-0" />
                    Medical History Warnings
                  </h4>
                  <div className="space-y-1.5 pt-1.5 border-t border-stone-50 dark:border-stone-800/80">
                    <div className="flex justify-between">
                      <span className="text-stone-400">Blood Pressure:</span>
                      <span className={`font-bold ${selectedStudent.medicalConditions.bloodPressure === "High" ? "text-rose-500" : "text-stone-800 dark:text-white"}`}>
                        {selectedStudent.medicalConditions.bloodPressure}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Diabetes:</span>
                      <span className="font-semibold text-stone-800 dark:text-white">{selectedStudent.medicalConditions.diabetes ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Heart Problems:</span>
                      <span className={`font-bold ${selectedStudent.medicalConditions.heartProblems ? "text-rose-500" : "text-stone-800 dark:text-white"}`}>
                        {selectedStudent.medicalConditions.heartProblems ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Back Pain:</span>
                      <span className="font-semibold text-stone-800 dark:text-white">{selectedStudent.medicalConditions.backPain ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Pregnancy:</span>
                      <span className="font-semibold text-stone-800 dark:text-white">{selectedStudent.medicalConditions.pregnancy ? "Yes" : "No"}</span>
                    </div>
                    <div className="text-stone-400 mt-2">Surgeries / Medications:</div>
                    <p className="font-semibold text-stone-800 dark:text-white bg-stone-50 dark:bg-brand-dark-bg p-2 rounded-lg leading-normal">
                      {selectedStudent.medicalConditions.surgeries || "None reported"}
                    </p>
                  </div>
                </div>

                {/* Physical Body Metrics & Score Assessment */}
                <div className="bg-white dark:bg-brand-dark-card p-5 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 space-y-3">
                  <h4 className="font-bold text-stone-800 dark:text-white flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-brand-primary" />
                    Student Health Assessment
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-y-2 border-t border-stone-50 dark:border-stone-800/80 pt-2.5">
                    <span className="text-stone-400">Weight & Height:</span>
                    <span className="font-semibold text-stone-800 dark:text-white">{selectedStudent.measurements.weight} kg / {selectedStudent.measurements.height} cm</span>

                    <span className="text-stone-400">BMI:</span>
                    <span className="font-bold text-brand-primary">{selectedStudent.measurements.bmi}</span>

                    <span className="text-stone-400">Stress level:</span>
                    <span className="font-semibold text-stone-800 dark:text-white">{selectedStudent.assessment.stressLevel}</span>
                  </div>

                  {/* Visual progress bar ratings (out of 10) */}
                  <div className="space-y-2 pt-2 border-t border-stone-50 dark:border-stone-800/80">
                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-stone-500 mb-0.5">
                        <span>Flexibility</span>
                        <span>{selectedStudent.assessment.flexibilityScore}/10</span>
                      </div>
                      <div className="w-full bg-stone-100 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-brand-secondary h-full rounded-full" style={{ width: `${selectedStudent.assessment.flexibilityScore * 10}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-stone-500 mb-0.5">
                        <span>Breathing Control</span>
                        <span>{selectedStudent.assessment.breathingScore}/10</span>
                      </div>
                      <div className="w-full bg-stone-100 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-brand-primary h-full rounded-full" style={{ width: `${selectedStudent.assessment.breathingScore * 10}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-stone-500 mb-0.5">
                        <span>Breathing Balance</span>
                        <span>{selectedStudent.assessment.balanceScore}/10</span>
                      </div>
                      <div className="w-full bg-stone-100 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-brand-accent h-full rounded-full" style={{ width: `${selectedStudent.assessment.balanceScore * 10}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Private Notes Panel - Strictly visible only to Admin and Instructors! */}
              {(role === "Admin" || role === "Instructor") ? (
                <div className="bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/40 p-5 rounded-2xl space-y-2 text-xs">
                  <div className="flex items-center gap-1 text-amber-800 dark:text-amber-400 font-bold">
                    <Lock className="w-4 h-4" />
                    <span>Private Instructor Notes (Confidential)</span>
                  </div>
                  <p className="text-stone-700 dark:text-stone-300 leading-relaxed font-medium bg-white/70 dark:bg-brand-dark-card p-3 rounded-xl border border-amber-50">
                    {selectedStudent.privateNotes || "No confidential instructor remarks recorded yet."}
                  </p>
                </div>
              ) : (
                <div className="bg-stone-100 dark:bg-stone-800 p-4 rounded-xl flex items-center gap-2 text-xs text-stone-500">
                  <Lock className="w-4 h-4" />
                  <span>Confidential private notes are hidden for Receptionist role.</span>
                </div>
              )}

              {/* Dynamic Ayurva AI Therapist Recommendations Calling Gemini */}
              <div className="bg-stone-900 text-stone-100 rounded-2xl p-5 border border-brand-primary/30 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-5 h-5 text-brand-accent shrink-0 animate-pulse" />
                    <h4 className="font-bold text-sm tracking-wide text-white">Ayurva AI Clinical Yoga Therapist</h4>
                  </div>
                  <span className="text-[10px] text-stone-400 bg-stone-800 px-2 py-0.5 rounded font-mono">Gemini 3.5</span>
                </div>

                <p className="text-xs text-stone-300 leading-normal">
                  Generate clinical yoga therapies, personalized breathing regimes, posture cautions, and dropout predictions using secure artificial intelligence.
                </p>

                {aiError && (
                  <div className="p-2.5 bg-rose-950/40 border border-rose-900 text-rose-300 rounded-xl text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>{aiError}</div>
                  </div>
                )}

                {!aiAnalysis ? (
                  <button
                    onClick={() => getAiAnalysis(selectedStudent)}
                    disabled={loadingAi}
                    className="w-full bg-brand-primary text-white text-xs font-semibold py-3 rounded-xl hover:bg-brand-primary/90 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow"
                  >
                    {loadingAi ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        Generating Health Blueprint...
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4 text-brand-accent" />
                        Run AI Therapy Generator
                      </>
                    )}
                  </button>
                ) : (
                  <div className="space-y-4 pt-4 border-t border-stone-800 text-xs text-stone-200">
                    
                    {/* Clinical Health Summary */}
                    <div>
                      <span className="font-bold text-brand-secondary">Clinical Assessment:</span>
                      <p className="mt-1 text-stone-300 leading-relaxed text-[11px] bg-stone-800/80 p-3 rounded-xl border border-stone-800">
                        {aiAnalysis.healthSummary}
                      </p>
                    </div>

                    {/* Prescribed Postures & Pranayamas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      
                      <div className="bg-stone-800/60 p-3 rounded-xl border border-stone-800/80">
                        <span className="font-bold text-brand-accent">Therapeutic Asanas:</span>
                        <ul className="list-disc list-inside space-y-1 mt-1 text-[11px] text-stone-300">
                          {aiAnalysis.recommendations?.asanas?.map((asana: string, idx: number) => (
                            <li key={idx}>{asana}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-stone-800/60 p-3 rounded-xl border border-stone-800/80">
                        <span className="font-bold text-brand-secondary">Pranayama Regimen:</span>
                        <ul className="list-disc list-inside space-y-1 mt-1 text-[11px] text-stone-300">
                          {aiAnalysis.recommendations?.pranayama?.map((pran: string, idx: number) => (
                            <li key={idx}>{pran}</li>
                          ))}
                        </ul>
                      </div>

                    </div>

                    {/* Strict cautions */}
                    <div className="bg-rose-950/20 border border-rose-900/50 p-3 rounded-xl">
                      <span className="font-bold text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> Strictly Avoid
                      </span>
                      <ul className="list-disc list-inside space-y-1 mt-1 text-[11px] text-rose-300">
                        {aiAnalysis.recommendations?.cautions?.map((caution: string, idx: number) => (
                          <li key={idx}>{caution}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Dropout Predictions */}
                    <div className="bg-brand-primary/10 p-3 rounded-xl border border-brand-primary/20 grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
                      <div>
                        <span className="text-[10px] text-brand-primary font-bold tracking-widest uppercase">Dropout Risk Assessment</span>
                        <div className="flex items-baseline gap-1.5 mt-1">
                          <span className="text-base font-bold text-white">{aiAnalysis.predictions?.dropoutRisk}</span>
                          <span className="text-[10px] text-stone-400">({aiAnalysis.predictions?.riskPercentage}% probability)</span>
                        </div>
                      </div>
                      <div className="text-[10px] text-stone-300 leading-normal">
                        <span className="font-bold text-brand-secondary">Retention Tip: </span>
                        {aiAnalysis.predictions?.engagementAction}
                      </div>
                    </div>

                    {/* Smart Custom Reminder Message */}
                    <div className="bg-stone-800/60 p-3.5 rounded-xl border border-stone-700/60">
                      <span className="text-[10px] text-brand-accent font-bold uppercase">AI-suggested payment notification tone:</span>
                      <p className="italic text-stone-300 leading-relaxed text-[11px] mt-1">
                        "{aiAnalysis.reminderSuggestions?.paymentReminder}"
                      </p>
                    </div>

                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Register Student Form Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-brand-dark-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
            
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-base font-bold text-stone-950 dark:text-white flex items-center gap-1.5">
                <User className="w-5 h-5 text-brand-primary" />
                New Student Enrollment Form
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-stone-100 dark:hover:bg-brand-dark-bg rounded-lg"
              >
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-5 text-xs text-stone-800 dark:text-stone-200">
              
              {/* Basic Fields */}
              <div className="space-y-3">
                <h4 className="font-bold text-brand-primary tracking-wide uppercase border-b border-stone-100 pb-1">1. Personal Particulars</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 font-semibold text-stone-500">Full Name *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Nimasha Fernando"
                      value={formData.fullName || ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      className="w-full bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-stone-500">Gender</label>
                    <select
                      value={formData.gender || "Female"}
                      onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as any }))}
                      className="w-full bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-stone-500">Date of Birth</label>
                    <input
                      type="date"
                      value={formData.dateOfBirth || ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      className="w-full bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-stone-500">NIC / Passport Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 199454120392"
                      value={formData.nicOrPassport || ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, nicOrPassport: e.target.value }))}
                      className="w-full bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-stone-500">Occupation</label>
                    <input
                      type="text"
                      placeholder="e.g. Designer"
                      value={formData.occupation || ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, occupation: e.target.value }))}
                      className="w-full bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-stone-500">City *</label>
                    <select
                      value={formData.district || "Gampaha"}
                      onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
                      className="w-full bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                    >
                      <option value="Mirigama">Mirigama</option>
                      <option value="Minuwangoda">Minuwangoda</option>
                      <option value="Gampaha">Gampaha</option>
                      <option value="Miriswatta">Miriswatta</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-stone-500">Phone Number *</label>
                    <input
                      required
                      type="tel"
                      placeholder="e.g. +94 77 123 4567"
                      value={formData.phone || ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-stone-500">WhatsApp Number</label>
                    <input
                      type="tel"
                      placeholder="e.g. +94 77 123 4567"
                      value={formData.whatsApp || ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, whatsApp: e.target.value }))}
                      className="w-full bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-brand-primary font-bold">Link to Yoga Class *</label>
                    <select
                      required
                      value={formData.classId || ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, classId: e.target.value }))}
                      className="w-full bg-stone-50 dark:bg-brand-dark-bg border border-brand-primary/30 dark:border-stone-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-primary font-semibold text-stone-800 dark:text-white"
                    >
                      <option value="">-- Select Yoga Class --</option>
                      {classes.map(cls => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name} ({cls.city})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 font-semibold text-stone-500">Residential Address</label>
                    <input
                      type="text"
                      placeholder="e.g. 45, Flower Road"
                      value={formData.address || ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-stone-500">Suburb / Locality</label>
                    <input
                      type="text"
                      placeholder="e.g. Town center, Bandarawatta"
                      value={formData.city || ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Medical History */}
              <div className="space-y-3">
                <h4 className="font-bold text-rose-500 tracking-wide uppercase border-b border-rose-100 pb-1">2. Confidential Medical History</h4>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-rose-50/40 dark:bg-rose-950/10 p-3 rounded-xl border border-rose-100/40">
                  <label className="flex items-center gap-2 font-semibold">
                    <input
                      type="checkbox"
                      checked={medicalConditions.diabetes}
                      onChange={(e) => setMedicalConditions(prev => ({ ...prev, diabetes: e.target.checked }))}
                      className="rounded border-stone-300 text-brand-primary focus:ring-brand-primary"
                    />
                    Diabetes
                  </label>

                  <label className="flex items-center gap-2 font-semibold">
                    <input
                      type="checkbox"
                      checked={medicalConditions.heartProblems}
                      onChange={(e) => setMedicalConditions(prev => ({ ...prev, heartProblems: e.target.checked }))}
                      className="rounded border-stone-300 text-brand-primary focus:ring-brand-primary"
                    />
                    Heart Problems
                  </label>

                  <label className="flex items-center gap-2 font-semibold">
                    <input
                      type="checkbox"
                      checked={medicalConditions.backPain}
                      onChange={(e) => setMedicalConditions(prev => ({ ...prev, backPain: e.target.checked }))}
                      className="rounded border-stone-300 text-brand-primary focus:ring-brand-primary"
                    />
                    Back Pain
                  </label>

                  <label className="flex items-center gap-2 font-semibold">
                    <input
                      type="checkbox"
                      checked={medicalConditions.pregnancy}
                      onChange={(e) => setMedicalConditions(prev => ({ ...prev, pregnancy: e.target.checked }))}
                      className="rounded border-stone-300 text-brand-primary focus:ring-brand-primary"
                    />
                    Pregnancy
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 font-semibold text-stone-500">Blood Pressure</label>
                    <select
                      value={medicalConditions.bloodPressure}
                      onChange={(e) => setMedicalConditions(prev => ({ ...prev, bloodPressure: e.target.value as any }))}
                      className="w-full bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                    >
                      <option value="Normal">Normal BP</option>
                      <option value="High">High BP (Hypertension)</option>
                      <option value="Low">Low BP (Hypotension)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-stone-500">Recent Surgeries / Fractures</label>
                    <input
                      type="text"
                      placeholder="List surgeries and years..."
                      value={medicalConditions.surgeries}
                      onChange={(e) => setMedicalConditions(prev => ({ ...prev, surgeries: e.target.value }))}
                      className="w-full bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Physical measurements & assessment scores */}
              <div className="space-y-3">
                <h4 className="font-bold text-brand-primary tracking-wide uppercase border-b border-stone-100 pb-1">3. Health Assessment & Baseline Scores</h4>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block mb-1 font-semibold text-stone-500">Weight (kg)</label>
                    <input
                      type="number"
                      value={measurements.weight}
                      onChange={(e) => handleWeightChange(Number(e.target.value))}
                      className="w-full bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-stone-500">Height (cm)</label>
                    <input
                      type="number"
                      value={measurements.height}
                      onChange={(e) => handleHeightChange(Number(e.target.value))}
                      className="w-full bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-stone-500">Calculated BMI</label>
                    <div className="bg-stone-100 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2 text-brand-primary font-bold">
                      {measurements.bmi}
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-stone-500">Stress Level</label>
                    <select
                      value={assessment.stressLevel}
                      onChange={(e) => setAssessment(prev => ({ ...prev, stressLevel: e.target.value as any }))}
                      className="w-full bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                    >
                      <option value="Low">Low</option>
                      <option value="Moderate">Moderate</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block mb-1 font-semibold text-stone-500">Flexibility Score (1-10)</label>
                    <input
                      type="range" min="1" max="10"
                      value={assessment.flexibilityScore}
                      onChange={(e) => setAssessment(prev => ({ ...prev, flexibilityScore: Number(e.target.value) }))}
                      className="w-full accent-brand-primary"
                    />
                    <div className="text-right font-bold text-brand-primary text-[10px] mt-0.5">{assessment.flexibilityScore} / 10</div>
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-stone-500">Breathing Score (1-10)</label>
                    <input
                      type="range" min="1" max="10"
                      value={assessment.breathingScore}
                      onChange={(e) => setAssessment(prev => ({ ...prev, breathingScore: Number(e.target.value) }))}
                      className="w-full accent-brand-primary"
                    />
                    <div className="text-right font-bold text-brand-primary text-[10px] mt-0.5">{assessment.breathingScore} / 10</div>
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-stone-500">Balance Score (1-10)</label>
                    <input
                      type="range" min="1" max="10"
                      value={assessment.balanceScore}
                      onChange={(e) => setAssessment(prev => ({ ...prev, balanceScore: Number(e.target.value) }))}
                      className="w-full accent-brand-primary"
                    />
                    <div className="text-right font-bold text-brand-primary text-[10px] mt-0.5">{assessment.balanceScore} / 10</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <label className="block font-semibold text-stone-500">Yoga Goals & Intentions</label>
                  <textarea
                    rows={2}
                    placeholder="Describe main therapeutic outcomes desired (e.g. relief from neck strain, improved core...)"
                    value={formData.goals || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, goals: e.target.value }))}
                    className="w-full bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  />
                </div>

                {role === "Admin" || role === "Instructor" ? (
                  <div className="grid grid-cols-1 gap-2 bg-amber-50/30 p-3 rounded-xl border border-amber-100/50">
                    <label className="font-bold text-amber-800 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> Confidential Notes (Instructor Only)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Add private physical alignment adjustments or mental block cautions..."
                      value={formData.privateNotes || ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, privateNotes: e.target.value }))}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                ) : null}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-brand-primary hover:bg-brand-primary/95 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow"
                >
                  Enroll & Print Member Card
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
