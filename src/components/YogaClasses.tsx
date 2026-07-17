import React, { useState } from "react";
import { 
  Calendar, Clock, Plus, X, Trash, Award, CheckCircle, MapPin
} from "lucide-react";
import { ClassSchedule } from "../types";

interface YogaClassesProps {
  classes: ClassSchedule[];
  onAddClass: (classSched: ClassSchedule) => void;
  onDeleteClass: (id: string) => void;
  role: string;
}

export default function YogaClasses({
  classes,
  onAddClass,
  onDeleteClass,
  role
}: YogaClassesProps) {
  const [showClassModal, setShowClassModal] = useState(false);
  const [newClass, setNewClass] = useState<Partial<ClassSchedule>>({
    name: "",
    instructorName: "Kumodya Dilshani",
    dayOfWeek: "Monday",
    startTime: "06:30",
    endTime: "07:30",
    type: "Morning Classes",
    capacity: 20,
    city: "Gampaha"
  });

  const handleCreateClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClass.name) return;

    const classToAdd: ClassSchedule = {
      id: `c-${Date.now()}`,
      name: newClass.name,
      instructorId: "u-1",
      instructorName: newClass.instructorName || "Kumodya Dilshani",
      dayOfWeek: newClass.dayOfWeek as any || "Monday",
      startTime: newClass.startTime || "06:30",
      endTime: newClass.endTime || "07:30",
      type: newClass.type as any || "Morning Classes",
      capacity: newClass.capacity || 20,
      enrolledCount: 0,
      waitingListCount: 0,
      isRecurring: true,
      city: newClass.city || "Gampaha"
    };

    onAddClass(classToAdd);
    setShowClassModal(false);
    setNewClass({ 
      name: "", 
      instructorName: "Kumodya Dilshani", 
      dayOfWeek: "Monday", 
      startTime: "06:30", 
      endTime: "07:30", 
      type: "Morning Classes", 
      capacity: 20,
      city: "Gampaha"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-white dark:bg-brand-dark-card p-5 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm gap-4">
        <div>
          <h4 className="font-bold text-base text-stone-800 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-primary" />
            Ayurva Yoga Weekly Schedule
          </h4>
          <p className="text-xs text-stone-500 mt-1">Interactive class roster management, schedule planning, and capacity tracking</p>
        </div>
        {role === "Admin" && (
          <button
            onClick={() => setShowClassModal(true)}
            className="bg-brand-primary hover:bg-brand-primary/95 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-sm self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Add Class Session
          </button>
        )}
      </div>

      {/* Visual Timetable schedule grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {classes.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-brand-dark-card border border-dashed border-stone-200 dark:border-stone-800 rounded-2xl p-10 text-center space-y-2">
            <Calendar className="w-10 h-10 text-stone-300 mx-auto" />
            <h5 className="font-bold text-stone-700 dark:text-stone-300 text-sm">No Scheduled Classes</h5>
            <p className="text-xs text-stone-400">Add a new yoga class session to start tracking attendance and rosters.</p>
          </div>
        ) : (
          classes.map(cls => {
            const capPercentage = Math.round((cls.enrolledCount / cls.capacity) * 100);

            return (
              <div key={cls.id} className="bg-white dark:bg-brand-dark-card rounded-2xl p-5 shadow-sm border border-stone-100 dark:border-stone-800 flex flex-col justify-between h-48 hover:shadow-md transition-shadow">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] bg-brand-primary/10 text-brand-primary font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {cls.type}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-stone-400">{cls.dayOfWeek}</span>
                      {role === "Admin" && (
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete the class "${cls.name}"?`)) {
                              onDeleteClass(cls.id);
                            }
                          }}
                          className="p-1 text-stone-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                          title="Delete Class"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <h3 className="font-bold text-stone-900 dark:text-white text-sm">{cls.name}</h3>
                  
                  <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{cls.startTime} - {cls.endTime}</span>
                    </div>
                    <div className="flex items-center gap-1 text-brand-primary font-medium bg-brand-primary/5 px-2 py-0.5 rounded-md">
                      <MapPin className="w-3 h-3" />
                      <span>{cls.city}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-stone-50 dark:border-stone-800">
                  <div className="flex justify-between text-[10px] font-bold text-stone-500">
                    <span>Roster Occupancy</span>
                    <span>{cls.enrolledCount}/{cls.capacity} Enrolled</span>
                  </div>
                  
                  <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        capPercentage > 90 ? "bg-rose-500" : capPercentage > 75 ? "bg-amber-500" : "bg-brand-secondary"
                      }`} 
                      style={{ width: `${capPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Class Modal Form */}
      {showClassModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-brand-dark-card rounded-2xl w-full max-w-sm p-6 shadow-2xl relative border-t-4 border-brand-primary">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="font-bold text-sm text-stone-950 dark:text-white flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-brand-primary" /> Create New Class Session
              </h3>
              <button onClick={() => setShowClassModal(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClassSubmit} className="space-y-4 text-xs text-stone-700 dark:text-stone-300">
              <div>
                <label className="block mb-1 font-semibold text-stone-500">Class Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Yin Yoga & Mindfulness"
                  value={newClass.name}
                  onChange={(e) => setNewClass(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-semibold text-stone-500">Class Category</label>
                  <select
                    value={newClass.type}
                    onChange={(e) => setNewClass(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  >
                    <option value="Morning Classes">Morning Classes</option>
                    <option value="Evening Classes">Evening Classes</option>
                    <option value="Weekend Classes">Weekend Classes</option>
                    <option value="Special Workshops">Special Workshops</option>
                    <option value="Meditation Sessions">Meditation Sessions</option>
                    <option value="Prenatal Yoga">Prenatal Yoga</option>
                    <option value="Kids Yoga">Kids Yoga</option>
                    <option value="Private Sessions">Private Sessions</option>
                    <option value="Online Classes">Online Classes</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-semibold text-stone-500">Day of Week</label>
                  <select
                    value={newClass.dayOfWeek}
                    onChange={(e) => setNewClass(prev => ({ ...prev, dayOfWeek: e.target.value as any }))}
                    className="w-full bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-semibold text-stone-500">City / Location *</label>
                  <select
                    value={newClass.city}
                    onChange={(e) => setNewClass(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  >
                    <option value="Mirigama">Mirigama</option>
                    <option value="Minuwangoda">Minuwangoda</option>
                    <option value="Gampaha">Gampaha</option>
                    <option value="Miriswatta">Miriswatta</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-semibold text-stone-500">Capacity</label>
                  <input
                    type="number"
                    value={newClass.capacity}
                    onChange={(e) => setNewClass(prev => ({ ...prev, capacity: Number(e.target.value) }))}
                    className="w-full bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-semibold text-stone-500">Start Time</label>
                  <input
                    type="time"
                    value={newClass.startTime}
                    onChange={(e) => setNewClass(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold text-stone-500">End Time</label>
                  <input
                    type="time"
                    value={newClass.endTime}
                    onChange={(e) => setNewClass(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowClassModal(false)}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold px-4 py-2 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-brand-primary hover:bg-brand-primary/95 text-white font-bold px-5 py-2 rounded-xl transition-all shadow animate-pulse-subtle"
                >
                  Schedule Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
