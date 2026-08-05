import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, CheckCircle2, XCircle, Search, Info, Check } from 'lucide-react';

export const UploadPermissions: React.FC = () => {
  const { guruMapelKelas, users, mapel, kelas, guruIzinUpload, toggleTeacherUploadPermission } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const teachers = users.filter(u => u.role === 'guru');

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed bottom-5 right-5 bg-emerald-800 text-white px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center space-x-2 text-xs font-semibold">
          <Check className="w-4 h-4 text-emerald-300" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Kontrol Izin Upload Tugas Guru (`Guru_Izin_Upload`)
        </h2>
        <p className="text-xs text-slate-500">
          Admin menentukan guru mana yang diizinkan membuat/mengunggah tugas untuk mata pelajaran & kelas tertentu.
        </p>
      </div>

      {/* Info Card */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start space-x-3 text-xs text-amber-900">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Aturan Hak Akses Pengunggahan Tugas:</p>
          <p className="text-amber-800 leading-relaxed">
            Jika status diatur <span className="font-bold text-rose-700">Dibatasi (Nonaktif)</span>, guru tetap dapat melihat tugas dan jawaban masuk, tetapi tombol <span className="font-bold">"Buat Tugas Baru"</span> pada dashboard guru akan dinonaktifkan dengan pemberitahuan khusus dari Admin.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama guru, mapel, atau kelas..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Permission Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <th className="p-3.5">Nama Guru</th>
                <th className="p-3.5">Mata Pelajaran</th>
                <th className="p-3.5">Kelas</th>
                <th className="p-3.5">Status Izin Upload</th>
                <th className="p-3.5 text-right">Aksi Toggle Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {guruMapelKelas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    Belum ada penugasan guru pengajar. Sila atur di menu "Mapel & Pengajar" terlebih dahulu.
                  </td>
                </tr>
              ) : (
                guruMapelKelas
                  .filter(gmk => {
                    const guruObj = teachers.find(t => t.id === gmk.guru_id);
                    const mapelObj = mapel.find(m => m.id === gmk.mapel_id);
                    const classObj = kelas.find(k => k.id === gmk.kelas_id);

                    const query = searchTerm.toLowerCase();
                    return (
                      guruObj?.nama.toLowerCase().includes(query) ||
                      mapelObj?.nama_mapel.toLowerCase().includes(query) ||
                      classObj?.nama_kelas.toLowerCase().includes(query)
                    );
                  })
                  .map(gmk => {
                    const guruObj = teachers.find(t => t.id === gmk.guru_id);
                    const mapelObj = mapel.find(m => m.id === gmk.mapel_id);
                    const classObj = kelas.find(k => k.id === gmk.kelas_id);

                    const permissionRecord = guruIzinUpload.find(
                      p => p.guru_id === gmk.guru_id && p.mapel_id === gmk.mapel_id && p.kelas_id === gmk.kelas_id
                    );

                    const isAllowed = permissionRecord ? permissionRecord.diizinkan : true;

                    return (
                      <tr key={gmk.id} className="hover:bg-slate-50 transition">
                        <td className="p-3.5">
                          <div className="font-bold text-slate-900">{guruObj?.nama || 'Guru'}</div>
                          <div className="text-[10px] text-slate-400">{guruObj?.email}</div>
                        </td>
                        <td className="p-3.5">
                          <span className="font-semibold text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                            {mapelObj?.nama_mapel} ({mapelObj?.kode_mapel})
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                            Kelas {classObj?.nama_kelas}
                          </span>
                        </td>
                        <td className="p-3.5">
                          {isAllowed ? (
                            <span className="inline-flex items-center space-x-1.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-full">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Diizinkan Membuat Tugas</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1.5 bg-rose-100 text-rose-800 text-[11px] font-bold px-2.5 py-1 rounded-full">
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              <span>Dibatasi oleh Admin</span>
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => {
                              toggleTeacherUploadPermission(gmk.guru_id, gmk.mapel_id, gmk.kelas_id, !isAllowed);
                              showToast(
                                `Izin upload ${guruObj?.nama} (${mapelObj?.kode_mapel} ${classObj?.nama_kelas}) diubah menjadi ${
                                  !isAllowed ? 'Diizinkan' : 'Dibatasi'
                                }.`
                              );
                            }}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition shadow-xs ${
                              isAllowed
                                ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700'
                            }`}
                          >
                            {isAllowed ? 'Batasi Upload' : 'Berikan Izin Upload'}
                          </button>
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
