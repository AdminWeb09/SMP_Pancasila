import React from 'react';
import { useApp } from '../context/AppContext';
import { NotificationDropdown } from './NotificationDropdown';
import { Menu, LogOut, GraduationCap, Shield, UserCheck, School } from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
  onNavigateLink?: (linkId?: string, jenis?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onNavigateLink }) => {
  const { currentUser, logout, kelas } = useApp();

  if (!currentUser) return null;

  // Check if teacher is Wali Kelas
  const homeroomClass = kelas.find(k => k.wali_kelas_id === currentUser.id);

  const getRoleBadge = () => {
    switch (currentUser.role) {
      case 'admin':
        return (
          <span className="bg-amber-50 text-amber-800 border border-amber-200 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded flex items-center space-x-1.5">
            <Shield className="w-3 h-3 text-amber-600" />
            <span>Administrator</span>
          </span>
        );
      case 'guru':
        return (
          <span className="bg-blue-50 text-blue-800 border border-blue-200 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded flex items-center space-x-1.5">
            <UserCheck className="w-3 h-3 text-blue-600" />
            <span>Guru {homeroomClass ? `• Wali ${homeroomClass.nama_kelas}` : ''}</span>
          </span>
        );
      case 'murid':
        return (
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded flex items-center space-x-1.5">
            <GraduationCap className="w-3 h-3 text-emerald-600" />
            <span>Siswa Aktif</span>
          </span>
        );
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 h-16 shrink-0">
      <div className="w-full h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left branding / sidebar toggle */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleSidebar}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded lg:hidden transition"
            title="Menu Buka/Tutup"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0 lg:hidden">
              <School className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-900 tracking-tight">
                  SMP PANCASILA KRIAN
                </span>
                <span className="hidden sm:inline-block text-[10px] font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded">
                  NPSN 120412
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
                Sistem Informasi & Pengumpulan Tugas Terpadu
              </p>
            </div>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-2">
            {getRoleBadge()}
          </div>

          <NotificationDropdown onSelectLink={onNavigateLink} />

          <div className="h-5 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center space-x-2.5">
            <img
              src={currentUser.foto_profil || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={currentUser.nama}
              className="w-8 h-8 rounded-full object-cover border border-slate-300 shrink-0"
            />
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-slate-900 leading-none truncate max-w-[130px]">
                {currentUser.nama}
              </p>
              <p className="text-[10px] text-slate-500 font-mono leading-tight truncate mt-0.5">
                {currentUser.nisn_nip || currentUser.email}
              </p>
            </div>

            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition ml-1"
              title="Keluar dari Akun"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
