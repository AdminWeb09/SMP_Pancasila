import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, GraduationCap, UserCheck, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

export const QuickRoleSwitcher: React.FC = () => {
  const { currentUser, switchUser, users, resetSystemData } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const adminUser = users.find(u => u.role === 'admin');
  const guruBambang = users.find(u => u.id === 'usr_guru_bambang'); // Wali Kelas 7A
  const guruSiti = users.find(u => u.id === 'usr_guru_siti'); // Wali Kelas 7B
  const muridRizky = users.find(u => u.id === 'usr_murid_rizky'); // Murid 7A

  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-2 shadow-inner">
      <div className="flex items-center space-x-2">
        <span className="bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px] tracking-wide uppercase">
          Demo Quick Switcher
        </span>
        <span className="text-slate-300 hidden sm:inline">
          Uji Coba Peran Pengguna SMP PANCASILA Krian:
        </span>
      </div>

      <div className="flex items-center space-x-2 flex-wrap">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="sm:hidden text-slate-300 hover:text-white flex items-center space-x-1"
        >
          <span>Pilih Akun ({currentUser?.nama.split(' ')[0]})</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <div className={`${isOpen ? 'flex' : 'hidden'} sm:flex flex-wrap items-center gap-1.5 w-full sm:w-auto mt-2 sm:mt-0`}>
          {adminUser && (
            <button
              onClick={() => switchUser(adminUser.id)}
              className={`px-2.5 py-1 rounded-md font-medium transition flex items-center space-x-1 ${
                currentUser?.id === adminUser.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Shield className="w-3 h-3" />
              <span>Admin ({adminUser.nama.split(' ')[1] || 'Admin'})</span>
            </button>
          )}

          {guruBambang && (
            <button
              onClick={() => switchUser(guruBambang.id)}
              className={`px-2.5 py-1 rounded-md font-medium transition flex items-center space-x-1 ${
                currentUser?.id === guruBambang.id
                  ? 'bg-blue-500 text-white font-bold shadow-sm'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <UserCheck className="w-3 h-3" />
              <span>Guru/Wali 7A ({guruBambang.nama.split(' ')[1]})</span>
            </button>
          )}

          {guruSiti && (
            <button
              onClick={() => switchUser(guruSiti.id)}
              className={`px-2.5 py-1 rounded-md font-medium transition flex items-center space-x-1 ${
                currentUser?.id === guruSiti.id
                  ? 'bg-purple-500 text-white font-bold shadow-sm'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <UserCheck className="w-3 h-3" />
              <span>Guru B. Indo ({guruSiti.nama.split(' ')[1]})</span>
            </button>
          )}

          {muridRizky && (
            <button
              onClick={() => switchUser(muridRizky.id)}
              className={`px-2.5 py-1 rounded-md font-medium transition flex items-center space-x-1 ${
                currentUser?.id === muridRizky.id
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <GraduationCap className="w-3 h-3" />
              <span>Murid ({muridRizky.nama.split(' ')[0]})</span>
            </button>
          )}

          <button
            onClick={() => {
              if (confirm('Atur ulang seluruh data simulasi ke kondisi awal SMP PANCASILA?')) {
                resetSystemData();
              }
            }}
            title="Reset Data Simulasi"
            className="px-2 py-1 bg-rose-950/80 text-rose-300 hover:bg-rose-900 rounded-md border border-rose-800/50 flex items-center space-x-1 transition ml-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden md:inline">Reset Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
