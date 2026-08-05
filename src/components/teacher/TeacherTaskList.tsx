import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Tugas } from '../../types';
import { CreateTaskModal } from './CreateTaskModal';
import {
  FileCheck2,
  Plus,
  Trash2,
  Edit,
  Users,
  Clock,
  Paperclip,
  AlertCircle,
  Eye,
  Check,
  Laptop,
  Sparkles,
  Award,
  BookOpen,
} from 'lucide-react';
import { formatDateTime, isDeadlinePassed } from '../../utils/helpers';

interface TeacherTaskListProps {
  onSelectTask: (taskId: string) => void;
  mode?: 'tugas' | 'ulangan';
}

export const TeacherTaskList: React.FC<TeacherTaskListProps> = ({ onSelectTask, mode = 'tugas' }) => {
  const { currentUser, tugas, jawaban, kelas, mapel, deleteTask, canTeacherUploadTask } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Tugas | null>(null);

  const [filterClassId, setFilterClassId] = useState('semua');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (!currentUser) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const isExamMode = mode === 'ulangan';

  const myTasks = tugas.filter(t => {
    if (t.guru_id !== currentUser.id) return false;
    if (isExamMode) {
      return t.jenis === 'Ulangan Harian' || t.jenis === 'UTS' || t.jenis === 'UAS';
    }
    return !t.jenis || t.jenis === 'Tugas Biasa';
  });

  const filteredTasks = myTasks.filter(t => {
    if (filterClassId !== 'semua' && t.kelas_id !== filterClassId) return false;
    return true;
  });

  const handleDelete = (t: Tugas, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Apakah Anda yakin ingin menghapus tugas "${t.judul}"? Semua jawaban murid akan terhapus.`)) {
      deleteTask(t.id);
      showToast('Tugas berhasil dihapus.');
    }
  };

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed bottom-5 right-5 bg-emerald-800 text-white px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center space-x-2 text-xs font-semibold">
          <Check className="w-4 h-4 text-emerald-300" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {isExamMode ? 'Portal LMS Pengelolaan Ulangan & Ujian' : 'Kelola & Terbitkan Tugas Pembelajaran'}
          </h2>
          <p className="text-xs text-slate-500">
            {isExamMode
              ? 'SMP PANCASILA Krian | Terbitkan Ulangan Harian, UTS, dan UAS dalam format CBT Online dengan koreksi otomatis.'
              : 'SMP PANCASILA Krian | Daftar seluruh tugas harian & PR yang diterbitkan untuk murid.'}
          </p>
        </div>

        <button
          onClick={() => {
            setEditingTask(null);
            setIsModalOpen(true);
          }}
          className={`px-4 py-2.5 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-2 ${
            isExamMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>{isExamMode ? 'Buat Ulangan / Ujian Baru' : 'Buat Tugas Baru'}</span>
        </button>
      </div>

      {/* Teacher LMS CBT Banner */}
      {isExamMode && (
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl shadow-xl border border-indigo-800/50 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-2 bg-indigo-500/20 text-indigo-300 text-[10px] font-black px-3 py-1 rounded-full border border-indigo-400/30">
                <Sparkles className="w-3 h-3 text-indigo-300" />
                <span>SMP PANCASILA KRIAN — GURU EVALUATOR LMS</span>
              </div>
              <h3 className="text-lg font-black text-white">Sistem CBT & Koreksi Otomatis Active</h3>
              <p className="text-xs text-slate-300">
                Semua evaluasi jenis Ulangan Harian, UTS, dan UAS yang diterbitkan akan otomatis mendukung Ujian CBT Online murid serta perhitungan nilai otomatis.
              </p>
            </div>

            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur p-3 rounded-2xl border border-white/10 shrink-0 text-xs">
              <Laptop className="w-8 h-8 text-blue-400" />
              <div>
                <p className="font-extrabold text-white">Bank Soal & Timer</p>
                <p className="text-[10px] text-slate-300">Terintegrasi Ke Halaman Siswa</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Options */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs">
          <span className="font-bold text-slate-700">Filter Kelas:</span>
          <select
            value={filterClassId}
            onChange={e => setFilterClassId(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none"
          >
            <option value="semua">Semua Kelas</option>
            {kelas.map(k => (
              <option key={k.id} value={k.id}>
                Kelas {k.nama_kelas}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Task List Cards */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            <FileCheck2 className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-600 mb-1">
              {isExamMode ? 'Belum Ada Ulangan / Ujian Diterbitkan' : 'Belum Ada Tugas Diterbitkan'}
            </p>
            <p>
              Klik tombol "{isExamMode ? 'Buat Ulangan / Ujian Baru' : 'Buat Tugas Baru'}" di atas untuk menambahkan.
            </p>
          </div>
        ) : (
          filteredTasks.map(task => {
            const mapelObj = mapel.find(m => m.id === task.mapel_id);
            const classObj = kelas.find(k => k.id === task.kelas_id);
            const isPassed = isDeadlinePassed(task.deadline);

            const taskSubmissions = jawaban.filter(j => j.tugas_id === task.id);
            const gradedCount = taskSubmissions.filter(j => j.status === 'sudah_dinilai').length;

            return (
              <div
                key={task.id}
                onClick={() => onSelectTask(task.id)}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                      Kelas {classObj?.nama_kelas || '-'}
                    </span>
                    <span className="bg-purple-100 text-purple-800 font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                      {mapelObj?.nama_mapel || '-'}
                    </span>
                    <span className="bg-blue-100 text-blue-800 font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-blue-200">
                      {task.jenis || 'Tugas Biasa'} ({task.bobot_nilai || 20}%)
                    </span>
                    {isPassed ? (
                      <span className="bg-rose-100 text-rose-800 font-bold text-[10px] px-2 py-0.5 rounded-full">
                        Selesai (Lewat Deadline)
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-800 font-bold text-[10px] px-2 py-0.5 rounded-full">
                        Aktif
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-base hover:text-emerald-700 transition">
                    {task.judul}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {task.deskripsi}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Deadline: {formatDateTime(task.deadline)}</span>
                    </div>

                    {task.file_lampiran && (
                      <div className="flex items-center space-x-1 text-emerald-700 font-semibold">
                        <Paperclip className="w-3.5 h-3.5" />
                        <span>Ada Lampiran</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submissions & Actions */}
                <div className="flex items-center justify-between md:justify-end space-x-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <p className="text-xs font-bold text-slate-800">
                      {taskSubmissions.length} Jawaban Masuk
                    </p>
                    <p className="text-[10px] text-emerald-600 font-semibold">
                      {gradedCount} Sudah Dinilai
                    </p>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setEditingTask(task);
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Edit Tugas"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={e => handleDelete(task, e)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Hapus Tugas"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onSelectTask(task.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center space-x-1 ml-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Periksa</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <CreateTaskModal
          editingTask={editingTask}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTask(null);
          }}
          onSuccess={() => {
            setIsModalOpen(false);
            setEditingTask(null);
            showToast(editingTask ? 'Tugas berhasil diperbarui.' : 'Tugas baru berhasil diterbitkan!');
          }}
        />
      )}
    </div>
  );
};
