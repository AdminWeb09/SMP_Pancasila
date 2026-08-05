import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Download, FileSpreadsheet, FileText, Search, Info } from 'lucide-react';
import { exportToExcel } from '../../utils/export';
import { calculateSemesterGrade } from '../../utils/gradeCalculator';

export const TeacherGradeRecap: React.FC = () => {
  const { currentUser, guruMapelKelas, kelas, mapel, tugas, jawaban, nilaiFeedback, muridKelas, users } = useApp();

  if (!currentUser) return null;

  const myAssignments = guruMapelKelas.filter(g => g.guru_id === currentUser.id);

  const [selectedClassId, setSelectedClassId] = useState(myAssignments[0]?.kelas_id || kelas[0]?.id || '');
  const [selectedMapelId, setSelectedMapelId] = useState(myAssignments[0]?.mapel_id || mapel[0]?.id || '');

  const classObj = kelas.find(k => k.id === selectedClassId);
  const mapelObj = mapel.find(m => m.id === selectedMapelId);

  // Get tasks for this class & mapel
  const targetTasks = tugas.filter(t => t.kelas_id === selectedClassId && t.mapel_id === selectedMapelId);

  // Get enrolled students
  const studentRels = muridKelas.filter(m => m.kelas_id === selectedClassId);
  const studentIds = studentRels.map(m => m.murid_id);
  const enrolledStudents = users.filter(u => studentIds.includes(u.id));

  const handleExportExcel = () => {
    if (!classObj || !mapelObj) return;

    const excelData = enrolledStudents.map((s, idx) => {
      const row: Record<string, any> = {
        No: idx + 1,
        NISN: s.nip_nisn || '-',
        'Nama Murid': s.nama,
      };

      let sumScore = 0;
      let countGraded = 0;

      targetTasks.forEach(task => {
        const sub = jawaban.find(j => j.tugas_id === task.id && j.murid_id === s.id);
        const grade = sub ? nilaiFeedback.find(n => n.jawaban_id === sub.id) : null;

        row[task.judul] = grade ? grade.nilai_angka : sub ? 'Belum Dinilai' : 'Belum Kumpul';

        if (grade) {
          sumScore += grade.nilai_angka;
          countGraded++;
        }
      });

      row['Rata-Rata'] = countGraded > 0 ? (sumScore / countGraded).toFixed(1) : '-';
      return row;
    });

    exportToExcel(
      `Rekap_Nilai_${mapelObj.kode_mapel}_Kelas_${classObj.nama_kelas}_SMP_PANCASILA`,
      `Kelas ${classObj.nama_kelas}`,
      excelData
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Rekapitutasi Nilai Per Kelas
          </h2>
          <p className="text-xs text-slate-500">
            Matriks rekap nilai seluruh murid pada mata pelajaran dan kelas yang Anda ampu.
          </p>
        </div>

        <button
          onClick={handleExportExcel}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-2"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export Rekap Excel (.xlsx)</span>
        </button>
      </div>

      {/* Select Class & Mapel Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center space-x-2 text-xs w-full sm:w-auto">
          <span className="font-bold text-slate-700">Pilih Kelas:</span>
          <select
            value={selectedClassId}
            onChange={e => setSelectedClassId(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none"
          >
            {kelas.map(k => (
              <option key={k.id} value={k.id}>
                Kelas {k.nama_kelas}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2 text-xs w-full sm:w-auto">
          <span className="font-bold text-slate-700">Pilih Mapel:</span>
          <select
            value={selectedMapelId}
            onChange={e => setSelectedMapelId(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none"
          >
            {mapel.map(m => (
              <option key={m.id} value={m.id}>
                {m.nama_mapel} ({m.kode_mapel})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grade Table Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <th className="p-3.5 w-12">No</th>
                <th className="p-3.5">Nama Murid</th>
                <th className="p-3.5">NISN</th>
                {targetTasks.map(t => (
                  <th key={t.id} className="p-3.5 text-center min-w-[120px]">
                    <span className="truncate block max-w-[140px] mx-auto" title={t.judul}>
                      {t.judul}
                    </span>
                    <span className="text-[9px] font-normal text-slate-400 block">
                      {t.jenis || 'Tugas'} ({t.bobot_nilai || 20}%)
                    </span>
                  </th>
                ))}
                <th className="p-3.5 text-center bg-blue-50 text-blue-900 font-extrabold border-l border-blue-100">
                  Nilai Akhir Semester (Berbobot)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {enrolledStudents.length === 0 ? (
                <tr>
                  <td colSpan={4 + targetTasks.length} className="p-8 text-center text-slate-400">
                    Tidak ada murid terdaftar di kelas ini.
                  </td>
                </tr>
              ) : (
                enrolledStudents.map((s, idx) => {
                  const semesterRes = calculateSemesterGrade(s.id, targetTasks, jawaban, nilaiFeedback);

                  return (
                    <tr key={s.id} className="hover:bg-slate-50 transition">
                      <td className="p-3.5 font-bold text-slate-400">{idx + 1}</td>
                      <td className="p-3.5 font-bold text-slate-900">{s.nama}</td>
                      <td className="p-3.5 font-mono text-[11px] text-slate-500">{s.nip_nisn || '-'}</td>

                      {targetTasks.map(t => {
                        const sub = jawaban.find(j => j.tugas_id === t.id && j.murid_id === s.id);
                        const grade = sub ? nilaiFeedback.find(n => n.jawaban_id === sub.id) : null;

                        return (
                          <td key={t.id} className="p-3.5 text-center">
                            {grade ? (
                              <span className="font-bold text-slate-900 bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
                                {grade.nilai_angka}
                              </span>
                            ) : sub ? (
                              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                                Belum Dinilai
                              </span>
                            ) : (
                              <span className="text-slate-300">-</span>
                            )}
                          </td>
                        );
                      })}

                      <td className="p-3.5 text-center bg-blue-50/70 border-l border-blue-100 font-extrabold text-blue-900 text-sm">
                        {semesterRes.finalScore !== null ? (
                          <div className="flex flex-col items-center">
                            <span className="text-base font-black text-blue-800">{semesterRes.finalScore}</span>
                            <span className="text-[9px] text-blue-600 font-medium">
                              {semesterRes.predikat}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
