import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, Download, AlertTriangle, FileText, Award, Users, CheckCircle2 } from 'lucide-react';
import { exportHomeroomReportCardPDF } from '../../utils/export';
import { calculateSemesterGrade } from '../../utils/gradeCalculator';

export const HomeroomDashboard: React.FC = () => {
  const { currentUser, kelas, muridKelas, users, mapel, tugas, jawaban, nilaiFeedback } = useApp();

  if (!currentUser) return null;

  // Find homeroom class for current teacher
  const homeroomClass = kelas.find(k => k.wali_kelas_id === currentUser.id);

  if (!homeroomClass) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto mb-2" />
        <h3 className="font-bold text-slate-800 text-base">Bukan Wali Kelas</h3>
        <p className="text-xs text-slate-500 mt-1">
          Akun Anda saat ini tidak ditugaskan sebagai Wali Kelas pada ruang kelas manapun.
        </p>
      </div>
    );
  }

  // Get enrolled students in homeroom class
  const classStudentRels = muridKelas.filter(m => m.kelas_id === homeroomClass.id);
  const studentIds = classStudentRels.map(m => m.murid_id);
  const homeroomStudents = users.filter(u => studentIds.includes(u.id));

  // Get tasks assigned to this class
  const classTasks = tugas.filter(t => t.kelas_id === homeroomClass.id);

  // Compute stats per student
  const studentReportData = homeroomStudents.map(student => {
    // Collect all submissions and late counts
    let lateCount = 0;
    let missingCount = 0;
    let totalScoreSum = 0;
    let gradedTasksCount = 0;

    const mapelScores: { mapel: string; nilai: number | string; predikat: string }[] = [];

    mapel.forEach(mpl => {
      const mplTasks = classTasks.filter(t => t.mapel_id === mpl.id);

      mplTasks.forEach(task => {
        const sub = jawaban.find(j => j.tugas_id === task.id && j.murid_id === student.id);
        if (!sub) {
          missingCount++;
        } else if (sub.status === 'terlambat') {
          lateCount++;
        }
      });

      const semesterRes = calculateSemesterGrade(student.id, mplTasks, jawaban, nilaiFeedback);

      if (semesterRes.finalScore !== null) {
        totalScoreSum += semesterRes.finalScore;
        gradedTasksCount++;
      }

      mapelScores.push({
        mapel: mpl.nama_mapel,
        nilai: semesterRes.finalScore !== null ? semesterRes.finalScore : '-',
        predikat: semesterRes.predikat,
      });
    });

    const studentAvg = gradedTasksCount > 0 ? totalScoreSum / gradedTasksCount : 0;

    return {
      student,
      mapelScores,
      rataRata: studentAvg,
      jumlahSeringTelat: lateCount + missingCount,
      lateCount,
      missingCount,
    };
  });

  // Sort students by late/missing frequency descending to highlight problem students first!
  const sortedByRisk = [...studentReportData].sort((a, b) => b.jumlahSeringTelat - a.jumlahSeringTelat);

  const handleExportPDF = () => {
    const formattedData = studentReportData.map(item => ({
      nama: item.student.nama,
      nisn: item.student.nip_nisn || '-',
      mapelScores: item.mapelScores,
      rataRata: item.rataRata,
      jumlahSeringTelat: item.jumlahSeringTelat,
    }));

    exportHomeroomReportCardPDF(
      homeroomClass.nama_kelas,
      currentUser.nama,
      'Ganjil 2025/2026',
      formattedData
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="bg-amber-400 text-slate-950 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-2">
            Dashboard Khusus Wali Kelas
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight">
            Rekap Rapor & Kedisiplinan Kelas {homeroomClass.nama_kelas}
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm max-w-xl mt-1">
            Pantau perkembangan nilai lintas mata pelajaran dan identifikasi murid yang sering mengalami keterlambatan atau belum mengumpulkan tugas.
          </p>
        </div>

        <button
          onClick={handleExportPDF}
          className="px-5 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold text-xs rounded-2xl shadow-lg transition flex items-center justify-center space-x-2 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Cetak PDF Rekap Rapor Kelas</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Bimbingan Murid</p>
            <h3 className="text-2xl font-extrabold text-slate-900">{homeroomStudents.length} Siswa</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Kelas {homeroomClass.nama_kelas}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-rose-100 text-rose-800 rounded-2xl shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Perlu Perhatian Khusus</p>
            <h3 className="text-2xl font-extrabold text-rose-700">
              {studentReportData.filter(s => s.jumlahSeringTelat > 0).length} Siswa
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Sering Telat / Belum Kumpul</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-purple-100 text-purple-800 rounded-2xl shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Mata Pelajaran Aktif</p>
            <h3 className="text-2xl font-extrabold text-slate-900">{mapel.length} Mapel</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Penilaian Lintas Mapel</p>
          </div>
        </div>
      </div>

      {/* Warning List: Students with Late/Missing Submissions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          <span>Daftar Siswa Dengan Keterlambatan / Belum Mengumpulkan Tugas</span>
        </h3>

        <div className="space-y-2">
          {sortedByRisk.filter(s => s.jumlahSeringTelat > 0).length === 0 ? (
            <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Sangat Bagus! Seluruh murid di Kelas {homeroomClass.nama_kelas} mengumpulkan tugas tepat waktu.</span>
            </div>
          ) : (
            sortedByRisk
              .filter(s => s.jumlahSeringTelat > 0)
              .map(item => (
                <div
                  key={item.student.id}
                  className="p-3.5 bg-rose-50/60 border border-rose-200 rounded-xl flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.student.foto_profil || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}
                      alt={item.student.nama}
                      className="w-8 h-8 rounded-full object-cover border border-rose-300"
                    />
                    <div>
                      <p className="font-bold text-slate-900">{item.student.nama}</p>
                      <p className="text-[10px] text-slate-500">NISN: {item.student.nip_nisn || '-'}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-rose-800 bg-rose-200 px-2.5 py-1 rounded-full text-[11px]">
                      {item.jumlahSeringTelat} Catatan Keterlambatan
                    </span>
                    <p className="text-[10px] text-rose-600 mt-0.5">
                      {item.lateCount} x Telat | {item.missingCount} x Belum Kumpul
                    </p>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      {/* Cross-Subject Grade Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-xs">
            Matriks Nilai Rapor Lintas Mata Pelajaran (Kelas {homeroomClass.nama_kelas})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <th className="p-3.5 w-12">No</th>
                <th className="p-3.5">Nama Murid</th>
                <th className="p-3.5">NISN</th>
                {mapel.map(m => (
                  <th key={m.id} className="p-3.5 text-center min-w-[90px]">
                    {m.kode_mapel}
                  </th>
                ))}
                <th className="p-3.5 text-center bg-emerald-100 text-emerald-950 font-extrabold">
                  Rata-Rata Kelas
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {studentReportData.map((item, idx) => (
                <tr key={item.student.id} className="hover:bg-slate-50 transition">
                  <td className="p-3.5 font-bold text-slate-400">{idx + 1}</td>
                  <td className="p-3.5 font-bold text-slate-900">{item.student.nama}</td>
                  <td className="p-3.5 font-mono text-[11px] text-slate-500">{item.student.nip_nisn || '-'}</td>

                  {item.mapelScores.map((ms, i) => (
                    <td key={i} className="p-3.5 text-center">
                      {ms.nilai !== '-' ? (
                        <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                          {ms.nilai}
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                  ))}

                  <td className="p-3.5 text-center bg-emerald-50/60 font-extrabold text-emerald-900 text-sm">
                    {item.rataRata > 0 ? item.rataRata.toFixed(1) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
