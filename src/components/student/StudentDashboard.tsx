import React from 'react';
import { useApp } from '../../context/AppContext';
import { GraduationCap, Clock, Award, FileCheck2, CheckCircle2, ArrowUpRight, MessageSquare } from 'lucide-react';
import { formatDateTime, getTimeRemaining } from '../../utils/helpers';

interface StudentDashboardProps {
  onNavigate: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate }) => {
  const { currentUser, muridKelas, kelas, tugas, jawaban, nilaiFeedback, mapel } = useApp();

  if (!currentUser) return null;

  // Find student class
  const classRel = muridKelas.find(m => m.murid_id === currentUser.id);
  const studentClass = classRel ? kelas.find(k => k.id === classRel.kelas_id) : null;

  // Tasks for student's class
  const myClassTasks = studentClass ? tugas.filter(t => t.kelas_id === studentClass.id) : [];

  // Student's submissions
  const mySubmissions = jawaban.filter(j => j.murid_id === currentUser.id);

  const submittedTaskIds = mySubmissions.map(j => j.tugas_id);

  // Active unsubmitted tasks
  const activeUnsubmittedTasks = myClassTasks.filter(
    t => !submittedTaskIds.includes(t.id) && new Date(t.deadline) > new Date()
  );

  // Graded tasks
  const myGrades = nilaiFeedback.filter(n => {
    const sub = mySubmissions.find(j => j.id === n.jawaban_id);
    return !!sub;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-2 bg-emerald-400/20 text-emerald-200 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-400/30">
            <GraduationCap className="w-4 h-4" />
            <span>Portal Siswa SMP PANCASILA Krian</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hai, {currentUser.nama}!
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm max-w-xl leading-relaxed">
            {studentClass
              ? `Terdaftar di Kelas ${studentClass.nama_kelas}. Pantau tenggat waktu tugas dan lihat hasil penilaian dari guru.`
              : 'Silakan minta Admin untuk memplotkan ruang kelas Anda.'}
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-100 text-amber-800 rounded-2xl shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Tugas Belum Dikirim</p>
            <h3 className="text-2xl font-extrabold text-slate-900">{activeUnsubmittedTasks.length}</h3>
            <p className="text-[11px] text-amber-600 font-semibold mt-0.5">Perlu Dikerjakan</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl shrink-0">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Tugas Terkumpul</p>
            <h3 className="text-2xl font-extrabold text-slate-900">{mySubmissions.length}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Dari Total {myClassTasks.length} Tugas</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-purple-100 text-purple-800 rounded-2xl shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Sudah Dinilai</p>
            <h3 className="text-2xl font-extrabold text-slate-900">{myGrades.length}</h3>
            <p className="text-[11px] text-purple-600 font-semibold mt-0.5">Lihat Feedback Guru</p>
          </div>
        </div>
      </div>

      {/* Quick Navigation Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigate('student-tasks')}
          className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl shadow-sm text-left transition flex items-center justify-between group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900">Tugas Harian (PR)</h4>
              <p className="text-[10px] text-slate-500">Kumpulkan latihan harian</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
        </button>

        <button
          onClick={() => onNavigate('student-exams')}
          className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl shadow-sm text-left transition flex items-center justify-between group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-100 text-blue-800 rounded-xl">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900">Ulangan & Ujian</h4>
              <p className="text-[10px] text-slate-500">UH, UTS, dan UAS</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
        </button>

        <button
          onClick={() => onNavigate('student-grades')}
          className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl shadow-sm text-left transition flex items-center justify-between group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-purple-100 text-purple-800 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900">Hasil & Rekap Nilai</h4>
              <p className="text-[10px] text-slate-500">Nilai akhir semester</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition" />
        </button>
      </div>

      {/* Immediate Attention: Active Unsubmitted Tasks */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Tugas Aktif Mesti Dikerjakan (Mendekati Deadline)</span>
          </h3>
          <button
            onClick={() => onNavigate('student-tasks')}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center space-x-1"
          >
            <span>Lihat Semua Tugas</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {activeUnsubmittedTasks.length === 0 ? (
          <div className="p-6 bg-slate-50 rounded-xl text-center text-slate-400 text-xs">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
            <span>Semua tugas kelas telah Anda kumpulkan! Luar biasa!</span>
          </div>
        ) : (
          <div className="space-y-3">
            {activeUnsubmittedTasks.map(task => {
              const mapelObj = mapel.find(m => m.id === task.mapel_id);

              return (
                <div
                  key={task.id}
                  onClick={() => onNavigate('student-tasks')}
                  className="p-4 bg-amber-50/50 border border-amber-200 hover:border-amber-400 rounded-xl transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="bg-amber-200 text-amber-900 font-bold text-[10px] px-2 py-0.5 rounded-md">
                      {mapelObj?.nama_mapel}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-1">{task.judul}</h4>
                    <p className="text-slate-500 line-clamp-1">{task.deskripsi}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full text-[11px] inline-block">
                      {getTimeRemaining(task.deadline)}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">Deadline: {formatDateTime(task.deadline)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Grades & Feedback */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center space-x-2">
          <Award className="w-4 h-4 text-purple-600" />
          <span>Nilai & Catatan Evaluasi Terbaru Dari Guru</span>
        </h3>

        {myGrades.length === 0 ? (
          <p className="text-xs text-slate-400 italic">Belum ada tugas yang dinilai oleh guru.</p>
        ) : (
          <div className="space-y-3">
            {myGrades.slice(0, 3).map(grade => {
              const sub = mySubmissions.find(j => j.id === grade.jawaban_id);
              const task = sub ? tugas.find(t => t.id === sub.tugas_id) : null;
              const mapelObj = task ? mapel.find(m => m.id === task.mapel_id) : null;

              return (
                <div
                  key={grade.id}
                  className="p-4 bg-purple-50/40 border border-purple-200 rounded-xl text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded text-[10px]">
                      {mapelObj?.nama_mapel || 'Mapel'}
                    </span>
                    <div className="flex items-center space-x-1.5">
                      <span className="font-extrabold text-slate-900 text-base">{grade.nilai_angka}</span>
                      <span className="font-bold text-purple-800 bg-purple-200 px-2 py-0.5 rounded-full text-[10px]">
                        {grade.predikat}
                      </span>
                    </div>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">{task?.judul}</h4>

                  <div className="p-3 bg-white rounded-lg border border-purple-100 text-slate-700 space-y-1">
                    <p className="font-semibold text-purple-900 flex items-center space-x-1 text-[11px]">
                      <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
                      <span>Feedback Guru:</span>
                    </p>
                    <p className="italic text-slate-600">"{grade.komentar_guru}"</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
