import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileViewerModal } from '../FileViewerModal';
import { FileAttachment } from '../../types';
import { Award, MessageSquare, Eye, FileText, CheckCircle2, Calculator, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDateTime } from '../../utils/helpers';
import { calculateSemesterGrade } from '../../utils/gradeCalculator';

export const StudentGrades: React.FC = () => {
  const { currentUser, jawaban, tugas, mapel, nilaiFeedback } = useApp();

  const [previewFile, setPreviewFile] = useState<FileAttachment | null>(null);
  const [expandedMapelId, setExpandedMapelId] = useState<string | null>(null);

  if (!currentUser) return null;

  // Student submissions
  const mySubmissions = jawaban.filter(j => j.murid_id === currentUser.id);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Nilai & Feedback Guru Saya
        </h2>
        <p className="text-xs text-slate-500">
          SMP PANCASILA Krian | Rekapitulasi Nilai Akhir Semester per Mata Pelajaran beserta Rincian Perhitungannya.
        </p>
      </div>

      {/* Section 1: Semester Final Grade Summary per Mapel */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
          <Calculator className="w-4 h-4 text-blue-600" />
          <span>Rekap Nilai Akhir Semester Per Mata Pelajaran</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mapel.map(m => {
            const mapelTasks = tugas.filter(t => t.mapel_id === m.id);
            const res = calculateSemesterGrade(currentUser.id, mapelTasks, jawaban, nilaiFeedback);
            const isExpanded = expandedMapelId === m.id;

            return (
              <div
                key={m.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:border-blue-300 transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {m.kode_mapel}
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-sm">{m.nama_mapel}</h4>
                  </div>

                  <div className="text-right">
                    {res.finalScore !== null ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-black text-blue-900">{res.finalScore}</span>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                          {res.predikat}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs font-semibold">Belum ada nilai</span>
                    )}
                  </div>
                </div>

                {/* Formula string summary */}
                {res.finalScore !== null && (
                  <div className="pt-2 border-t border-slate-100 text-[11px] space-y-2">
                    <button
                      onClick={() => setExpandedMapelId(isExpanded ? null : m.id)}
                      className="w-full flex items-center justify-between text-blue-700 font-bold hover:underline"
                    >
                      <span>Rincian Perhitungan Bobot</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isExpanded && (
                      <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-200">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          Rumus Kontribusi:
                        </p>
                        <p className="font-mono text-[10px] text-slate-700 bg-white p-2 rounded border border-slate-200 leading-relaxed">
                          {res.formulaString}
                        </p>
                        <div className="space-y-1 pt-1">
                          {res.breakdown.map((b, bIdx) => (
                            <div key={bIdx} className="flex justify-between text-[11px]">
                              <span className="text-slate-600">
                                {b.jenis} ({b.weightPercentage}%):
                              </span>
                              <span className="font-bold text-slate-800">
                                {b.averageScore !== null ? b.averageScore.toFixed(1) : 'Belum Ada'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Detailed Submissions List */}
      <div className="space-y-3 pt-2">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
          <Award className="w-4 h-4 text-emerald-600" />
          <span>Riwayat Penilaian & Feedback Per Tugas</span>
        </h3>
        <div className="space-y-4">
          {mySubmissions.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
              <Award className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-600 mb-1">Belum Ada Jawaban Terkirim</p>
              <p>Kumpulkan tugas di menu "Daftar Tugas" untuk menerima nilai dari guru.</p>
            </div>
          ) : (
            mySubmissions.map(sub => {
              const task = tugas.find(t => t.id === sub.tugas_id);
              const mapelObj = task ? mapel.find(m => m.id === task.mapel_id) : null;
              const grade = nilaiFeedback.find(n => n.jawaban_id === sub.id);

              return (
                <div
                  key={sub.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <span className="bg-purple-100 text-purple-800 font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                        {mapelObj?.nama_mapel || 'Mapel'}
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-base mt-1">
                        {task?.judul || 'Tugas'}
                      </h3>
                    </div>

                    <div className="text-left sm:text-right">
                      {grade ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-black text-slate-900">{grade.nilai_angka}</span>
                          <span className="bg-emerald-100 text-emerald-800 font-extrabold text-xs px-3 py-1 rounded-full">
                            {grade.predikat}
                          </span>
                        </div>
                      ) : (
                        <span className="bg-amber-100 text-amber-800 font-bold text-xs px-3 py-1 rounded-full">
                          Sedang Dimeriksa Guru
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                    <div className="space-y-1">
                      <p className="text-slate-400 text-[11px]">
                        Waktu Dikirim: <span className="font-semibold text-slate-700">{formatDateTime(sub.waktu_upload)}</span>
                      </p>
                      {sub.file_jawaban && (
                        <button
                          onClick={() => setPreviewFile(sub.file_jawaban)}
                          className="font-bold text-emerald-700 hover:underline flex items-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Lihat Jawaban Saya ({sub.file_jawaban.nama})</span>
                        </button>
                      )}
                    </div>

                    {grade && (
                      <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200 space-y-1">
                        <p className="font-bold text-purple-900 flex items-center space-x-1 text-[11px]">
                          <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
                          <span>Komentar Guru:</span>
                        </p>
                        <p className="italic text-slate-700 leading-relaxed">"{grade.komentar_guru}"</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* File Viewer Modal */}
      {previewFile && (
        <FileViewerModal attachment={previewFile} onClose={() => setPreviewFile(null)} />
      )}
    </div>
  );
};
