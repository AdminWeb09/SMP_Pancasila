import React from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Building2, BookOpen, FileCheck2, ShieldCheck, Lock, ArrowUpRight } from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { users, kelas, mapel, tugas, guruIzinUpload } = useApp();

  const totalTeachers = users.filter(u => u.role === 'guru').length;
  const totalStudents = users.filter(u => u.role === 'murid').length;
  const totalClasses = kelas.length;
  const totalSubjects = mapel.length;
  const totalTasks = tugas.length;
  const restrictedUploads = guruIzinUpload.filter(g => !g.diizinkan).length;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-500/30">
            <ShieldCheck className="w-4 h-4" />
            <span>Hak Akses Administrator Sekolah</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Panel Kontrol Utama Admin SMP PANCASILA
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Kelola data master akun guru & murid, ruang kelas, penugasan wali kelas, mata pelajaran, serta pengaturan izin khusus pembuatan tugas.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Pengguna</p>
            <h3 className="text-2xl font-extrabold text-slate-900">{users.length}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {totalTeachers} Guru | {totalStudents} Murid
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-800 rounded-2xl shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Ruang Kelas</p>
            <h3 className="text-2xl font-extrabold text-slate-900">{totalClasses}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Kelas 7A - 9B</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-purple-100 text-purple-800 rounded-2xl shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Mata Pelajaran</p>
            <h3 className="text-2xl font-extrabold text-slate-900">{totalSubjects}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Kurikulum Nasional</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-100 text-amber-800 rounded-2xl shrink-0">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Tugas Terdata</p>
            <h3 className="text-2xl font-extrabold text-slate-900">{totalTasks}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Pengumpulan Aktif</p>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div>
        <h3 className="text-base font-bold text-slate-800 mb-3">Aksi Cepat Admin</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigate('admin-users')}
            className="p-5 bg-white hover:bg-slate-50 text-left border border-slate-200 rounded-2xl shadow-sm hover:shadow transition group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between w-full mb-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
                <Users className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 mb-1">Manajemen User</h4>
              <p className="text-xs text-slate-500">
                Tambah guru/murid baru, edit profil & atur ulang kata sandi.
              </p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('admin-classes')}
            className="p-5 bg-white hover:bg-slate-50 text-left border border-slate-200 rounded-2xl shadow-sm hover:shadow transition group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between w-full mb-3">
              <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
                <Building2 className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 mb-1">Kelas & Wali Kelas</h4>
              <p className="text-xs text-slate-500">
                Atur struktur kelas dan tetapkan guru sebagai Wali Kelas.
              </p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('admin-subjects')}
            className="p-5 bg-white hover:bg-slate-50 text-left border border-slate-200 rounded-2xl shadow-sm hover:shadow transition group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between w-full mb-3">
              <div className="p-2.5 bg-purple-50 text-purple-700 rounded-xl">
                <BookOpen className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 mb-1">Mata Pelajaran</h4>
              <p className="text-xs text-slate-500">
                Plotting pengajar per mapel dan kelas yang diampu.
              </p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('admin-permissions')}
            className="p-5 bg-white hover:bg-slate-50 text-left border border-slate-200 rounded-2xl shadow-sm hover:shadow transition group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between w-full mb-3">
              <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl">
                <Lock className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition" />
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="font-bold text-sm text-slate-900">Kontrol Izin Upload</h4>
                {restrictedUploads > 0 && (
                  <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {restrictedUploads} Dibatasi
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Atur kewenangan guru dalam membuat/mengunggah tugas baru.
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
