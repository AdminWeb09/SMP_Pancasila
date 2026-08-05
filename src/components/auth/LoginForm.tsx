import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { School, LogIn, Lock, Mail, AlertCircle, ShieldCheck, GraduationCap, UserCheck } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const { login, users } = useApp();

  const [email, setEmail] = useState('admin@smppancasila.sch.id');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = login(email, password);
    if (!result.success) {
      setError(result.message || 'Gagal masuk. Cek email dan password Anda.');
    }
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    login(demoEmail, 'password123');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header Branding */}
        <div className="p-8 bg-slate-900 text-white text-center relative overflow-hidden">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg font-bold text-3xl">
            <School className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">SMP PANCASILA</h1>
          <p className="text-xs text-emerald-300 mt-1 font-semibold">
            NPSN 120412 | Kec. Krian, Kab. Sidoarjo
          </p>
          <p className="text-[11px] text-slate-300 mt-0.5">
            Yayasan Taman Pendidikan Al-Hidayah Krian Sidoarjo
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-2 text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Terdaftar</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="email@smppancasila.sch.id"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Kata Sandi (Password)</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk Ke Sistem</span>
            </button>
          </form>

          {/* Quick Demo Login Presets */}
          <div className="pt-4 border-t border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2.5">
              Pilih Akun Uji Coba Cepat:
            </p>

            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => handleQuickLogin('admin@smppancasila.sch.id')}
                className="p-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold transition flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Admin Sekolah (Bpk. Wahyu)</span>
                </div>
                <span className="text-[10px] text-amber-700 font-semibold">Masuk &rarr;</span>
              </button>

              <button
                onClick={() => handleQuickLogin('bambang@smppancasila.sch.id')}
                className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-xl text-xs font-bold transition flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  <span>Guru & Wali Kelas 7A (Bpk. Bambang)</span>
                </div>
                <span className="text-[10px] text-blue-700 font-semibold">Masuk &rarr;</span>
              </button>

              <button
                onClick={() => handleQuickLogin('rizky@siswa.smppancasila.sch.id')}
                className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-bold transition flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <GraduationCap className="w-4 h-4 text-emerald-600" />
                  <span>Murid Kelas 7A (Ahmad Rizky)</span>
                </div>
                <span className="text-[10px] text-emerald-700 font-semibold">Masuk &rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
