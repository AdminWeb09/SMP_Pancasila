import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileViewerModal } from '../FileViewerModal';
import { GradingModal } from './GradingModal';
import { FileAttachment, Jawaban } from '../../types';
import { ArrowLeft, Clock, Eye, Award, CheckCircle2, AlertCircle, FileText, Download, Check } from 'lucide-react';
import { formatDateTime } from '../../utils/helpers';

interface TaskSubmissionsViewProps {
  taskId: string;
  onBack: () => void;
}

export const TaskSubmissionsView: React.FC<TaskSubmissionsViewProps> = ({ taskId, onBack }) => {
  const { tugas, jawaban, nilaiFeedback, users, muridKelas, mapel, kelas } = useApp();

  const [previewFile, setPreviewFile] = useState<FileAttachment | null>(null);
  const [gradingSubmission, setGradingSubmission] = useState<{
    submission: Jawaban;
    studentName: string;
  } | null>(null);

  const [filterStatus, setFilterStatus] = useState<'semua' | 'sudah_dinilai' | 'belum_dinilai' | 'belum_kumpul'>('semua');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const task = tugas.find(t => t.id === taskId);
  if (!task) {
    return (
      <div className="p-8 text-center text-slate-500 text-xs">
        Tugas tidak ditemukan.{' '}
        <button onClick={onBack} className="text-emerald-600 font-bold underline ml-1">
          Kembali
        </button>
      </div>
    );
  }

  const mapelObj = mapel.find(m => m.id === task.mapel_id);
  const classObj = kelas.find(k => k.id === task.kelas_id);

  // Get all students enrolled in this task's class
  const classStudentRels = muridKelas.filter(m => m.kelas_id === task.kelas_id);
  const enrolledStudentIds = classStudentRels.map(m => m.murid_id);
  const enrolledStudents = users.filter(u => enrolledStudentIds.includes(u.id));

  // Map each student to their submission state
  const studentSubmissions = enrolledStudents.map(student => {
    const sub = jawaban.find(j => j.tugas_id === taskId && j.murid_id === student.id);
    const grade = sub ? nilaiFeedback.find(n => n.jawaban_id === sub.id) : null;
    return {
      student,
      submission: sub,
      grade,
    };
  });

  const filteredList = studentSubmissions.filter(item => {
    if (filterStatus === 'sudah_dinilai') return item.submission?.status === 'sudah_dinilai';
    if (filterStatus === 'belum_dinilai') return item.submission && item.submission.status !== 'sudah_dinilai';
    if (filterStatus === 'belum_kumpul') return !item.submission;
    return true;
  });

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed bottom-5 right-5 bg-emerald-800 text-white px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center space-x-2 text-xs font-semibold">
          <Check className="w-4 h-4 text-emerald-300" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Back & Header */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs mb-3 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Tugas</span>
        </button>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2.5 py-0.5 rounded-full">
              Kelas {classObj?.nama_kelas || '-'}
            </span>
            <span className="bg-purple-100 text-purple-800 font-bold text-[10px] px-2.5 py-0.5 rounded-full">
              {mapelObj?.nama_mapel || '-'}
            </span>
          </div>

          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">{task.judul}</h2>
          <p className="text-xs text-slate-600 leading-relaxed">{task.deskripsi}</p>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            <div className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Deadline: {formatDateTime(task.deadline)}</span>
            </div>
            {task.file_lampiran && (
              <button
                onClick={() => setPreviewFile(task.file_lampiran || null)}
                className="flex items-center space-x-1 text-emerald-700 font-bold hover:underline"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Lihat Lampiran Soal Guru</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Submissions Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs">
          <span className="font-bold text-slate-700">Filter Status:</span>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as any)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none"
          >
            <option value="semua">Semua Murid ({enrolledStudents.length})</option>
            <option value="sudah_dinilai">Sudah Dinilai</option>
            <option value="belum_dinilai">Belum Dinilai / Perlu Diperiksa</option>
            <option value="belum_kumpul">Belum Mengumpulkan</option>
          </select>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <th className="p-3.5">Nama Murid</th>
                <th className="p-3.5">Waktu Pengumpulan</th>
                <th className="p-3.5">File Jawaban</th>
                <th className="p-3.5">Nilai & Predikat</th>
                <th className="p-3.5 text-right">Aksi Penilaian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    Tidak ada data murid yang memenuhi kriteria filter.
                  </td>
                </tr>
              ) : (
                filteredList.map(({ student, submission, grade }) => (
                  <tr key={student.id} className="hover:bg-slate-50 transition">
                    <td className="p-3.5">
                      <div className="flex items-center space-x-3">
                        <img
                          src={student.foto_profil || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}
                          alt={student.nama}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{student.nama}</p>
                          <p className="text-[10px] text-slate-400">NISN: {student.nip_nisn || '-'}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5">
                      {submission ? (
                        <div>
                          <p className="font-semibold text-slate-800">{formatDateTime(submission.waktu_upload)}</p>
                          {submission.status === 'terlambat' && (
                            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                              Terlambat
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Belum Mengumpulkan</span>
                      )}
                    </td>

                    <td className="p-3.5">
                      {submission?.file_jawaban ? (
                        <button
                          onClick={() => setPreviewFile(submission.file_jawaban)}
                          className="font-bold text-emerald-700 hover:underline flex items-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[140px]">{submission.file_jawaban.nama}</span>
                        </button>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    <td className="p-3.5">
                      {grade ? (
                        <div>
                          <span className="font-extrabold text-slate-900 text-sm">{grade.nilai_angka}</span>{' '}
                          <span className="text-[11px] font-bold text-emerald-700">({grade.predikat})</span>
                          <p className="text-[10px] text-slate-400 truncate max-w-[160px] italic">
                            "{grade.komentar_guru}"
                          </p>
                        </div>
                      ) : (
                        <span className="text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[10px]">
                          Belum Dinilai
                        </span>
                      )}
                    </td>

                    <td className="p-3.5 text-right">
                      {submission ? (
                        <button
                          onClick={() => setGradingSubmission({ submission, studentName: student.nama })}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow transition flex items-center space-x-1.5 ml-auto"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>{grade ? 'Edit Nilai' : 'Beri Nilai'}</span>
                        </button>
                      ) : (
                        <span className="text-slate-300 font-medium text-[11px]">N/A</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* File Preview Modal */}
      {previewFile && (
        <FileViewerModal attachment={previewFile} onClose={() => setPreviewFile(null)} />
      )}

      {/* Grading Modal */}
      {gradingSubmission && (
        <GradingModal
          submission={gradingSubmission.submission}
          studentName={gradingSubmission.studentName}
          taskTitle={task.judul}
          onClose={() => setGradingSubmission(null)}
          onSuccess={() => {
            setGradingSubmission(null);
            showToast('Nilai dan feedback berhasil disimpan!');
          }}
        />
      )}
    </div>
  );
};
