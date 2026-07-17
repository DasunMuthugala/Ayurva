import React, { useState, useRef } from "react";
import { 
  Settings, ShieldAlert, Download, Upload, RefreshCw, 
  Eye, Save, MapPin, Phone, Mail, Globe, Clock, Lock
} from "lucide-react";
import { BusinessSettings, AuditLog } from "../types";

interface SettingsAuditProps {
  settings: BusinessSettings;
  auditLogs: AuditLog[];
  onUpdateSettings: (settings: BusinessSettings) => void;
  onRestoreBackup: (state: any) => void;
  onClearLogs: () => void;
  role: string;
  lang: "English" | "Sinhala";
  onLanguageToggle: () => void;
  getCompleteState: () => any;
}

export default function SettingsAudit({
  settings,
  auditLogs,
  onUpdateSettings,
  onRestoreBackup,
  onClearLogs,
  role,
  lang,
  onLanguageToggle,
  getCompleteState
}: SettingsAuditProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<BusinessSettings>({ ...settings });
  const [isSaved, setIsSaved] = useState(false);

  // Guard: ONLY accessible to Admin or Instructor (with limited fields), hide settings from Receptionist!
  if (role === "Receptionist") {
    return (
      <div className="bg-white dark:bg-brand-dark-card rounded-2xl p-8 shadow-sm border border-stone-100 dark:border-stone-800 text-center space-y-4">
        <Lock className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-base font-bold text-stone-900 dark:text-white">Access Level Restricted</h3>
        <p className="text-xs text-stone-500 max-w-sm mx-auto">
          You are currently logged in as a Receptionist. Administrative configurations, backups, and audit trails require Admin or Instructor authorization.
        </p>
      </div>
    );
  }

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // State Backup (Download complete JSON)
  const handleBackupDownload = () => {
    const state = getCompleteState();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ayurva_yoga_backup_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    alert("System backup downloaded successfully! Keep this file secure.");
  };

  // State Restore (Upload JSON)
  const handleBackupUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.students && parsed.payments && parsed.attendance) {
          onRestoreBackup(parsed);
          alert("Restore complete! System has synced successfully.");
        } else {
          alert("Invalid backup file format. Must contain students, payments, and attendance datasets.");
        }
      } catch (err) {
        alert("Failed to parse JSON file. Ensure you've uploaded a valid Ayurva Studio backup.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Studio Profile Config - Span 2 */}
      <div className="lg:col-span-2 bg-white dark:bg-brand-dark-card rounded-2xl p-5 border border-stone-100 dark:border-stone-800 shadow-sm space-y-5 text-xs">
        <div className="flex justify-between items-center border-b pb-3 border-stone-50 dark:border-stone-800">
          <h4 className="font-bold text-sm text-stone-800 dark:text-white flex items-center gap-1.5">
            <Settings className="w-4 h-4 text-brand-primary" />
            Studio Profile Configuration
          </h4>
          <button
            onClick={onLanguageToggle}
            className="text-[10px] bg-brand-primary/10 text-brand-primary font-bold px-2.5 py-1 rounded-lg transition-all"
          >
            Language: {lang === "English" ? "English 🇬🇧" : "සිංහල 🇱🇰"}
          </button>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-4 text-stone-700 dark:text-stone-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-semibold text-stone-500">Business Name</label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                className="w-full bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-primary"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-stone-500">Logo URL</label>
              <input
                type="text"
                value={formData.logoUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, logoUrl: e.target.value }))}
                className="w-full bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2.5 focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-stone-500">Contact Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2.5 focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-stone-500">Contact Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2.5 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-semibold text-stone-500">Studio Residential Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className="w-full bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2.5 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-semibold text-stone-500">WhatsApp Alert Number</label>
              <input
                type="text"
                value={formData.whatsAppNum}
                onChange={(e) => setFormData(prev => ({ ...prev, whatsAppNum: e.target.value }))}
                className="w-full bg-stone-50 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2.5 focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-stone-500">Time Zone</label>
              <input
                type="text"
                value={formData.timeZone}
                disabled
                className="w-full bg-stone-100 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2.5 text-stone-400"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-stone-50 dark:border-stone-800">
            <button
              type="submit"
              className="bg-brand-primary hover:bg-brand-primary/95 text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-1 transition-all shadow-sm"
            >
              <Save className="w-4 h-4" />
              {isSaved ? "Settings Saved!" : "Save Changes"}
            </button>
          </div>
        </form>

      </div>

      {/* Backup, Restore & Dynamic Audit Trails - Span 1 */}
      <div className="space-y-6">
        
        {/* State Backup & Recovery Panel */}
        <div className="bg-white dark:bg-brand-dark-card rounded-2xl p-5 border border-stone-100 dark:border-stone-800 shadow-sm space-y-4 text-xs">
          <h4 className="font-bold text-sm text-stone-800 dark:text-white flex items-center gap-1.5">
            <Download className="w-4 h-4 text-brand-primary" />
            System Backup & Recovery
          </h4>
          <p className="text-[10px] text-stone-500 leading-normal">
            Export the complete student roster, payments, inquiries, and attendance database to a local JSON file. Restore at any time.
          </p>

          <div className="flex gap-2">
            <button
              onClick={handleBackupDownload}
              className="flex-1 bg-stone-50 hover:bg-stone-100 dark:bg-brand-dark-bg border border-stone-200 dark:border-stone-700 font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1 text-stone-700 dark:text-stone-300"
            >
              <Download className="w-4 h-4" />
              Backup state
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 bg-brand-primary hover:bg-brand-primary/95 font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1 text-white shadow-sm"
            >
              <Upload className="w-4 h-4 text-brand-accent" />
              Restore state
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleBackupUpload}
            accept=".json"
            className="hidden"
          />
        </div>

        {/* Dynamic Security Audit Trail */}
        <div className="bg-white dark:bg-brand-dark-card rounded-2xl p-5 border border-stone-100 dark:border-stone-800 shadow-sm space-y-4 text-xs">
          <div className="flex justify-between items-center border-b pb-2.5 border-stone-50 dark:border-stone-800">
            <h4 className="font-bold text-sm text-stone-800 dark:text-white flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              Security Audit Log
            </h4>
            {role === "Admin" && (
              <button
                onClick={onClearLogs}
                className="text-[9px] font-semibold text-stone-400 hover:text-rose-600 transition-all"
              >
                Clear Entries
              </button>
            )}
          </div>

          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {auditLogs.map(log => (
              <div key={log.id} className="p-2 bg-stone-50 dark:bg-brand-dark-bg border border-stone-100 dark:border-stone-800/60 rounded-xl space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="font-bold text-stone-900 dark:text-white">{log.username} ({log.role})</span>
                  <span className="text-stone-400 font-mono">{log.timestamp.split("T")[1].slice(0, 5)}</span>
                </div>
                <div className="text-[10px] text-brand-primary font-semibold">{log.action}</div>
                <p className="text-[10px] text-stone-500 leading-normal">{log.details}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
