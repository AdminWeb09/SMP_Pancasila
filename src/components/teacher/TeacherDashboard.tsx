import React from 'react';
import { useApp } from '../../context/AppContext';
import { FileCheck2, ClipboardList, Clock, AlertTriangle, ArrowUpRight, BookOpen } from 'lucide-react';

interface TeacherDashboardProps {
  onNavigate: (tab: string, taskId?: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onNavigate }) => {
  const { currentUser, tugas, jawaban, guruMapelKelas, kelas, mapel } = useApp();

  if (!currentUser) return null;

  const myTasks = tugas.filter(t => t.guru_id === currentUser.id);
  const myTaskIds = myTasks.map(t => t.id);

  const mySubmissions = jawaban.filter(j => myTaskIds.includes(j.tugas_id));
  const pendingGradingCount = mySubmissions.filter(j => j.status === 'belum_dinilai' || j.status === 'terlambat').length;

  const myAssignments = guruMapelKelas.filter(g => g.guru_id === currentUser.id);

  const homeroomClass = kelas.find(k => k.wali_kelas_id === currentUser.id);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-2 bg-emerald-400/20 text-emerald-200 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-400/30">
            <BookOpen className="w-4 h-4" />
            <span>Portal Tenaga Pendidik SMP PANCASILA</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Selamat Datang, {currentUser.nama}
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Kelola pembuatan tugas pembelajaran, periksa hasil unggahan lembar jawaban murid, dan masukkan nilai serta feedback secara terpadu.
          </p>

          {homeroomClass && (
            <div className="pt-2">
              <span className="bg-amber-400 text-slate-950 font-bold text-xs px-3 py-1 rounded-xl shadow inline-flex items-center space-x-1">
                <span>Wali Kelas {homeroomClass.nama_kelas}</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl shrink-0">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Tugas Dibuat</p>
            <h3 className="text-2xl font-extrabold text-slate-900">{myTasks.length}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Aktif Diampu</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-100 text-amber-800 rounded-2xl shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Jawaban Masuk</p>
            <h3 className="text-2xl font-extrabold text-slate-900">{mySubmissions.length}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Total Pengumpulan</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-rose-100 text-rose-800 rounded-2xl shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Perlu Penilaian</p>
            <h3 className="text-2xl font-extrabold text-slate-900">{pendingGradingCount}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Belum Dinilai</p>
          </div>
        </div>
      </div>

      {/* Assigned Classes & Mapel */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <span>Mata Pelajaran & Kelas Yang Diampu</span>
        </h3>

        {myAssignments.length === 0 ? (
          <p className="text-xs text-slate-400 italic">
            Belum ada kelas/mapel yang diplotkan oleh Admin untuk Anda.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {myAssignments.map(a => {
              const mapelObj = mapel.find(m => m.id === a.mapel_id);
              const classObj = kelas.find(k => k.id === a.kelas_id);
              return (
                <div
                  key={a.id}
                  className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center space-x-3 text-xs"
                >
                  <div className="w-9 h-9 bg-emerald-100 text-emerald-800 font-extrabold rounded-lg flex items-center justify-center shrink-0">
                    {classObj?.nama_kelas}
                  </div>
                  <div className="truncate">
                    <p className="font-bold text-slate-900 truncate">{mapelObj?.nama_mapel}</p>
                    <p className="text-[10px] text-slate-500">Kelas {classObj?.nama_kelas}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Action Shortcut Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigate('teacher-tasks')}
          className="p-5 bg-white hover:bg-slate-50 text-left border border-slate-200 rounded-2xl shadow-sm hover:shadow transition group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between w-full mb-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 mb-1">Kelola Tugas Harian</h4>
            <p className="text-xs text-slate-500">
              Unggah instruksi PR & latihan harian beserta lampiran file.
            </p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('teacher-exams')}
          className="p-5 bg-white hover:bg-slate-50 text-left border border-slate-200 rounded-2xl shadow-sm hover:shadow transition group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between w-full mb-3">
            <div className="p-2.5 bg-purple-50 text-purple-700 rounded-xl">
              <BookOpen className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 mb-1">Kelola Ulangan & Ujian</h4>
            <p className="text-xs text-slate-500">
              Terbitkan Ulangan Harian, UTS, dan UAS beserta bobot nilai.
            </p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('teacher-grading')}
          className="p-5 bg-white hover:bg-slate-50 text-left border border-slate-200 rounded-2xl shadow-sm hover:shadow transition group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between w-full mb-3">
            <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
              <ClipboardList className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 mb-1">Penilaian Jawaban</h4>
            <p className="text-xs text-slate-500">
              Periksa file jawaban murid, beri angka 0-100 dan komentar evaluasi.
            </p>
          </div>
        </button>

        {homeroomClass && (
          <button
            onClick={() => onNavigate('homeroom-dashboard')}
            className="p-5 bg-emerald-50 hover:bg-emerald-100 text-left border border-emerald-200 rounded-2xl shadow-sm hover:shadow transition group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between w-full mb-3">
              <div className="p-2.5 bg-emerald-600 text-white rounded-xl">
                <BookOpen className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-emerald-700 group-hover:text-emerald-900 transition" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-emerald-950 mb-1">Dashboard Wali Kelas {homeroomClass.nama_kelas}</h4>
              <p className="text-xs text-emerald-800">
                Rekap nilai lintas mapel & analisis keterlambatan pengumpulan murid.
              </p>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};
