import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Users,
  Building2,
  BookOpen,
  Lock,
  FileCheck2,
  FileText,
  Award,
  GraduationCap,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  ClipboardList,
  CheckCircle2,
  School
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onCloseMobile,
}) => {
  const { currentUser, kelas } = useApp();

  if (!currentUser) return null;

  const isHomeroom = kelas.some(k => k.wali_kelas_id === currentUser.id);

  const navItem = (id: string, label: string, icon: React.ReactNode, badge?: string) => {
    const active = activeTab === id;
    return (
      <button
        key={id}
        onClick={() => {
          setActiveTab(id);
          onCloseMobile();
        }}
        className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-colors ${
          active
            ? 'bg-blue-600 text-white font-semibold shadow-sm'
            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        }`}
      >
        <div className="flex items-center space-x-2.5 min-w-0">
          <span className={`${active ? 'text-white' : 'text-slate-400'}`}>{icon}</span>
          <span className="truncate">{label}</span>
        </div>
        <div className="flex items-center space-x-1 shrink-0">
          {badge && (
            <span
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                active ? 'bg-blue-700 text-blue-100' : 'bg-slate-800 text-blue-400 border border-blue-500/30'
              }`}
            >
              {badge}
            </span>
          )}
          <ChevronRight className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-slate-500'}`} />
        </div>
      </button>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-16 z-40 h-[calc(100vh-4rem)] w-64 bg-[#0F172A] border-r border-slate-800 text-slate-100 flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header inside Sidebar */}
        <div className="p-4 border-b border-slate-800 flex items-center space-x-3 bg-slate-900/60">
          <div className="w-9 h-9 bg-blue-600 rounded flex items-center justify-center font-bold text-lg text-white shadow-sm shrink-0">
            <School className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xs font-bold text-white tracking-tight leading-none truncate">
              SMP PANCASILA
            </h1>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-semibold truncate">
              PORTAL AKADEMIK
            </p>
          </div>
        </div>

        <div className="p-3 space-y-5 overflow-y-auto flex-1">
          {/* Nav Section */}
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2 px-3">
              NAVIGASI SISTEM
            </p>

            <div className="space-y-1">
              {currentUser.role === 'admin' && (
                <>
                  {navItem('admin-dashboard', 'Dashboard Utama', <LayoutDashboard className="w-4 h-4" />)}
                  {navItem('admin-users', 'Manajemen Pengguna', <Users className="w-4 h-4" />)}
                  {navItem('admin-classes', 'Kelas & Wali Kelas', <Building2 className="w-4 h-4" />)}
                  {navItem('admin-subjects', 'Mata Pelajaran', <BookOpen className="w-4 h-4" />)}
                  {navItem('admin-permissions', 'Kontrol Izin Upload', <Lock className="w-4 h-4" />)}
                </>
              )}

              {currentUser.role === 'guru' && (
                <>
                  {navItem('teacher-dashboard', 'Dashboard Guru', <LayoutDashboard className="w-4 h-4" />)}
                  {navItem('teacher-tasks', 'Kelola Tugas Harian', <FileCheck2 className="w-4 h-4" />)}
                  {navItem('teacher-exams', 'Kelola Ulangan & Ujian', <FileText className="w-4 h-4" />)}
                  {navItem('teacher-grading', 'Penilaian & Feedback', <ClipboardList className="w-4 h-4" />)}
                  {navItem('teacher-recap', 'Rekap Nilai Siswa', <Award className="w-4 h-4" />)}
                  {isHomeroom && (
                    <div className="pt-2 mt-2 border-t border-slate-800/80">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 px-3 mb-1.5">
                        AKSES WALI KELAS
                      </p>
                      {navItem(
                        'homeroom-dashboard',
                        'Monitoring Wali Kelas',
                        <ShieldAlert className="w-4 h-4 text-blue-400" />,
                        'Wali'
                      )}
                    </div>
                  )}
                </>
              )}

              {currentUser.role === 'murid' && (
                <>
                  {navItem('student-dashboard', 'Dashboard Murid', <LayoutDashboard className="w-4 h-4" />)}
                  {navItem('student-tasks', 'Tugas Harian (PR)', <FileCheck2 className="w-4 h-4" />)}
                  {navItem('student-exams', 'Ulangan & Ujian', <FileText className="w-4 h-4" />)}
                  {navItem('student-grades', 'Hasil & Rekap Nilai', <CheckCircle2 className="w-4 h-4" />)}
                </>
              )}
            </div>
          </div>

          {/* School Details Badge */}
          <div className="p-3 bg-slate-900/80 rounded border border-slate-800 text-[11px] text-slate-300 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-blue-400 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>NPSN 120412 (Akreditasi A)</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-snug">
              Kec. Krian, Kab. Sidoarjo, Jawa Timur (Yayasan Taman Pendidikan Al-Hidayah)
            </p>
          </div>
        </div>

        {/* Footer User Profile Card */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-900/90 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-500/40 text-blue-300 font-bold flex items-center justify-center shrink-0 text-xs">
            {currentUser.nama.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">{currentUser.nama}</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              {currentUser.role === 'admin' ? 'Administrator' : currentUser.role === 'guru' ? 'Tenaga Pengajar' : 'Siswa/Murid'}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
