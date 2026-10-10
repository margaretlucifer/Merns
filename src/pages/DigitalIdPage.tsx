import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { QRCodeDisplay } from '../components/common/QRCodeDisplay';
import {
  GraduationCap,
  ShieldCheck,
  Download,
  Printer,
  CheckCircle2,
  Calendar,
  Phone,
  Droplet,
  Building,
} from 'lucide-react';

export const DigitalIdPage: React.FC = () => {
  const { user } = useAuth();
  const [verifiedStatus, setVerifiedStatus] = useState<boolean | null>(null);

  const handlePrint = () => {
    window.print();
  };

  const verifySignature = () => {
    setVerifiedStatus(true);
    setTimeout(() => setVerifiedStatus(null), 4000);
  };

  const enrollmentId = user?.enrollmentNumber || 'ED-2023-CS-0428';
  const qrPayload = `EDUSPHERE-DIGITAL-ID:${enrollmentId}:ACTIVE:SECURE-HASH-7841B`;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Digital Student ID Card
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Official university identification badge with cryptographic gate access token.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={verifySignature}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-xs transition-colors whitespace-nowrap"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Verify Token</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors whitespace-nowrap"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {verifiedStatus && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Digital Signature Validated: Registered in University Registrar Directory with Active Academic Standing.
          </span>
        </div>
      )}

      {/* University ID Card Preview Canvas */}
      <div className="flex justify-center py-6">
        <div className="w-full max-w-lg bg-white rounded-3xl border-2 border-slate-800 shadow-xl overflow-hidden relative">
          {/* University Header Ribbon */}
          <div className="bg-indigo-900 text-white p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-indigo-300">
                  Government of India Accredited
                </div>
                <div className="text-sm font-bold tracking-tight leading-tight">
                  Indian Institute of Technology & Engineering
                </div>
                <div className="text-[10px] text-slate-300">Bengaluru Campus · Academic Directorate</div>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                VERIFIED
              </span>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              {/* Photo Box */}
              <div className="shrink-0 text-center space-y-2">
                <div className="w-32 h-36 rounded-xl overflow-hidden border-2 border-slate-300 shadow-xs bg-slate-100">
                  <img
                    src={user?.avatarUrl || '/src/assets/images/digital_id_student_1791650581125.jpg'}
                    alt={user?.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  STUDENT PASS
                </div>
              </div>

              {/* Student Details */}
              <div className="flex-1 space-y-3 text-xs w-full">
                <div>
                  <div className="text-lg font-extrabold text-slate-900 leading-tight">
                    {user?.name}
                  </div>
                  <div className="text-xs font-semibold text-indigo-600">
                    {enrollmentId}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-2.5 gap-x-3 text-slate-700 pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Department</span>
                    <strong className="text-slate-900 leading-tight block">{user?.department}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Program</span>
                    <strong className="text-slate-900 leading-tight block">B.Tech (2023-2027)</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Validity</span>
                    <strong className="text-slate-900 leading-tight block">July 31, 2027</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Blood Group</span>
                    <strong className="text-slate-900 leading-tight block">B+ (Positive)</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Emergency Contact</span>
                    <strong className="text-slate-900 leading-tight block">{user?.phone || '+91 98765 43210'} (Hostel Warden / Guardian)</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Strip with QR Code & Barcode */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left space-y-1">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Cryptographic Verification Token
                </div>
                <div className="font-mono text-[11px] text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
                  HASH: 7841B-EDUSPHERE-IITB-2026
                </div>
                <div className="text-[10px] text-slate-400">
                  Scan for Library & Turnstile Entry Access
                </div>
              </div>

              <div className="shrink-0 scale-90">
                <QRCodeDisplay
                  data={qrPayload}
                  size={100}
                  label="Turnstile Pass"
                  subtitle=""
                />
              </div>
            </div>
          </div>

          {/* Magnetic Stripe Simulator */}
          <div className="h-2 bg-slate-900 w-full" />
        </div>
      </div>
    </div>
  );
};
