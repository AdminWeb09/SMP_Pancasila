import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Tugas, FileAttachment } from '../../types';
import { SubmitTaskModal } from './SubmitTaskModal';
import { LmsExamRunnerModal } from '../lms/LmsExamRunnerModal';
import { FileViewerModal } from '../FileViewerModal';
import {
  FileCheck2,
  Clock,
  Upload,
  CheckCircle2,
  AlertCircle,
  Paperclip,
  Eye,
  Check,
  Laptop,
  Play,
  Award,
  Sparkles,
} from 'lucide-react';
import { formatDateTime, isDeadlinePassed, getTimeRemaining } from '../../utils/helpers';

interface StudentTaskListProps {
  mode?: 'tugas' | 'ulangan';
}

export const StudentTaskList: React.FC<StudentTaskListProps> = ({ mode = 'tugas' }) => {
  const { currentUser, muridKelas, kelas, tugas, jawaban, mapel, nilaiFeedback, submitJawaban, gradeSubmission } = useApp();

  const [submittingTask, setSubmittingTask] = useState<Tugas | null>(null);
  const [activeCbtExam, setActiveCbtExam] = useState<Tugas | null>(null);
  const [viewingAttachment, setViewingAttachment] = useState<FileAttachment | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (!currentUser) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const isExamMode = mode === 'ulangan';

  const classRel = muridKelas.find(m => m.murid_id === currentUser.id);
  const studentClass = classRel ? kelas.find(k => k.id === classRel.kelas_id) : null;

  // Class tasks filtered by mode
  const myClassTasks = studentClass
    ? tugas.filter(t => {
        if (t.kelas_id !== studentClass.id) return false;
        if (isExamMode) {
          return t.jenis === 'Ulangan Harian' || t.jenis === 'UTS' || t.jenis === 'UAS';
        }
        return !t.jenis || t.jenis === 'Tugas Biasa';
      })
    : [];

  // Separate active vs past tasks
  const activeTasks = myClassTasks.filter(t => !isDeadlinePassed(t.deadline));
  const pastTasks = myClassTasks.filter(t => isDeadlinePassed(t.deadline));

  const renderTaskCard = (task: Tugas) => {
    const mapelObj = mapel.find(m => m.id === task.mapel_id);
    const sub = jawaban.find(j => j.tugas_id === task.id && j.murid_id === currentUser.id);
    const grade = sub ? nilaiFeedback.find(n => n.jawaban_id === sub.id) : null;
    const isPassed = isDeadlinePassed(task.deadline);

    return (
      <div
        key={task.id}
        className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-purple-100 text-purple-800 font-bold text-[10px] px-2.5 py-0.5 rounded-full">
              {mapelObj?.nama_mapel || 'Mapel'}
            </span>
            <span className="bg-blue-100 text-blue-800 font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-blue-200">
              {task.jenis || 'Tugas Biasa'} ({task.bobot_nilai || 20}%)
            </span>

            {sub ? (
              sub.status === 'sudah_dinilai' ? (
                <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Sudah Dinilai ({grade?.nilai_angka || '100'})</span>
                </span>
              ) : sub.status === 'terlambat' ? (
                <span className="bg-rose-100 text-rose-800 font-bold text-[10px] px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3 text-rose-600" />
                  <span>Terkirim (Terlambat)</span>
                </span>
              ) : (
                <span className="bg-blue-100 text-blue-800 font-bold text-[10px] px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-blue-600" />
                  <span>Terkirim (Belum Dinilai)</span>
                </span>
              )
            ) : isPassed ? (
              <span className="bg-rose-100 text-rose-800 font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                Terlewat (Belum Kumpul)
              </span>
            ) : (
              <span className="bg-amber-100 text-amber-800 font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                Belum Dikirim
              </span>
            )}
          </div>

          <h3 className="font-extrabold text-slate-900 text-base">{task.judul}</h3>
          <p className="text-xs text-slate-600 leading-relaxed">{task.deskripsi}</p>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
            <div className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Deadline: {formatDateTime(task.deadline)} ({getTimeRemaining(task.deadline)})</span>
            </div>

            {task.file_lampiran && (
              <button
                onClick={() => setViewingAttachment(task.file_lampiran || null)}
                className="flex items-center space-x-1 text-emerald-700 font-bold hover:underline"
              >
                <Paperclip className="w-3.5 h-3.5" />
                <span>Lihat File Soal Guru</span>
              </button>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
          {isExamMode ? (
            <>
              <button
                onClick={() => setActiveCbtExam(task)}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl transition shadow flex items-center justify-center space-x-2"
              >
                <Laptop className="w-4 h-4" />
                <span>{sub ? 'Kerjakan Ulang CBT' : 'Mulai Ujian Online (CBT)'}</span>
              </button>
              <button
                onClick={() => setSubmittingTask(task)}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1.5"
                title="Unggah berkas lembar jawaban secara manual"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Unggah Berkas Manual</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setSubmittingTask(task)}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition shadow flex items-center space-x-2 ${
                sub
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>{sub ? 'Ubah / Unggah Ulang' : 'Kumpulkan Jawaban'}</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {toastMsg && (
        <div className="fixed bottom-5 right-5 bg-emerald-800 text-white px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center space-x-2 text-xs font-semibold">
          <Check className="w-4 h-4 text-emerald-300" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          {isExamMode ? 'Portal LMS Ulangan & Ujian Online (CBT)' : 'Daftar Tugas Pembelajaran Siswa'}
        </h2>
        <p className="text-xs text-slate-500">
          {isExamMode
            ? 'SMP PANCASILA Krian | Kerjakan Ulangan Harian, UTS, dan UAS secara langsung di Portal CBT LMS atau unggah berkas jawaban.'
            : 'SMP PANCASILA Krian | Tugas harian dipisahkan berdasarkan status aktif dan yang telah selesai/lewat deadline.'}
        </p>
      </div>

      {/* LMS CBT Hero Banner for Exam Mode */}
      {isExamMode && (
        <div className="p-6 bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white rounded-3xl shadow-xl relative overflow-hidden border border-blue-800/50 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1 max-w-xl">
              <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-300 text-[10px] font-black px-3 py-1 rounded-full border border-blue-400/30">
                <Sparkles className="w-3 h-3 text-blue-300" />
                <span>SMP PANCASILA — COMPUTER-BASED TEST (CBT LMS)</span>
              </div>
              <h3 className="text-lg font-black text-white tracking-tight">Ruang Ujian Online Interaktif</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Dilengkapi timer real-time, navigasi soal piktorial (Pilihan Ganda & Uraian), koreksi otomatis instan, serta fitur lampiran berkas oret-oretan.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur px-4 py-3 rounded-2xl border border-white/15 text-center shrink-0 space-y-1">
              <p className="text-[10px] uppercase tracking-wider font-extrabold text-blue-300">Total Ujian Aktif</p>
              <p className="text-2xl font-black text-white">{activeTasks.length} Evaluasi</p>
            </div>
          </div>
        </div>
      )}

      {/* Section 1: Active Tasks */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
          <Clock className="w-4 h-4 text-emerald-600" />
          <span>{isExamMode ? 'Ulangan / Ujian Aktif (Belum Lewat Deadline)' : 'Tugas Aktif (Belum Lewat Deadline)'}</span>
          <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-bold">
            {activeTasks.length}
          </span>
        </h3>

        {activeTasks.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            {isExamMode ? 'Tidak ada ulangan / ujian aktif saat ini.' : 'Tidak ada tugas aktif saat ini.'}
          </div>
        ) : (
          <div className="space-y-3">{activeTasks.map(renderTaskCard)}</div>
        )}
      </div>

      {/* Section 2: Past / Completed Tasks */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
          <FileCheck2 className="w-4 h-4 text-slate-500" />
          <span>{isExamMode ? 'Riwayat Ulangan / Ujian (Sudah Lewat Deadline)' : 'Riwayat Tugas (Sudah Lewat Deadline)'}</span>
          <span className="bg-slate-200 text-slate-700 text-xs px-2 py-0.5 rounded-full font-bold">
            {pastTasks.length}
          </span>
        </h3>

        {pastTasks.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            Belum ada riwayat tugas terdahulu.
          </div>
        ) : (
          <div className="space-y-3">{pastTasks.map(renderTaskCard)}</div>
        )}
      </div>

      {/* Submit Modal */}
      {submittingTask && (
        <SubmitTaskModal
          task={submittingTask}
          existingJawabanFile={
            jawaban.find(j => j.tugas_id === submittingTask.id && j.murid_id === currentUser.id)
              ?.file_jawaban
          }
          onClose={() => setSubmittingTask(null)}
          onSuccess={() => {
            setSubmittingTask(null);
            showToast('Jawaban berhasil diunggah!');
          }}
        />
      )}

      {/* CBT LMS Exam Modal */}
      {activeCbtExam && (
        <LmsExamRunnerModal
          task={activeCbtExam}
          student={currentUser}
          onClose={() => setActiveCbtExam(null)}
          onSubmitExam={(file, notes, autoScore) => {
            submitJawaban(activeCbtExam.id, file, notes);

            // Find created submission ID or auto-grade
            if (autoScore !== undefined) {
              const existingSub = jawaban.find(
                j => j.tugas_id === activeCbtExam.id && j.murid_id === currentUser.id
              );
              if (existingSub) {
                const pred = autoScore >= 90 ? 'Sangat Baik (A)' : autoScore >= 80 ? 'Baik (B)' : autoScore >= 70 ? 'Cukup (C)' : 'Kurang (D)';
                gradeSubmission(existingSub.id, autoScore, pred, 'Hasil nilai pilihan ganda dikoreksi otomatis oleh sistem LMS CBT.');
              }
            }

            setActiveCbtExam(null);
            showToast('Ujian CBT berhasil dikerjakan & dikirim ke guru!');
          }}
        />
      )}

      {/* File Viewer Modal */}
      {viewingAttachment && (
        <FileViewerModal
          attachment={viewingAttachment}
          onClose={() => setViewingAttachment(null)}
        />
      )}
    </div>
  );
};
