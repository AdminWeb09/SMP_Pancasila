import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Mapel } from '../../types';
import { Plus, Edit, Trash2, BookOpen, Users, UserPlus, X, Check } from 'lucide-react';

export const SubjectManagement: React.FC = () => {
  const {
    mapel,
    kelas,
    users,
    guruMapelKelas,
    addSubject,
    updateSubject,
    deleteSubject,
    assignTeacherToClassMapel,
    removeTeacherFromClassMapel,
  } = useApp();

  const teachers = users.filter(u => u.role === 'guru');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMapel, setEditingMapel] = useState<Mapel | null>(null);
  const [assigningMapel, setAssigningMapel] = useState<Mapel | null>(null);

  const [namaMapelInput, setNamaMapelInput] = useState('');
  const [kodeMapelInput, setKodeMapelInput] = useState('');

  // Assign teacher form
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleOpenAdd = () => {
    setNamaMapelInput('');
    setKodeMapelInput('');
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaMapelInput || !kodeMapelInput) return;
    addSubject(namaMapelInput, kodeMapelInput);
    setIsAddModalOpen(false);
    showToast(`Mata pelajaran ${namaMapelInput} ditambahkan.`);
  };

  const handleOpenEdit = (m: Mapel) => {
    setEditingMapel(m);
    setNamaMapelInput(m.nama_mapel);
    setKodeMapelInput(m.kode_mapel);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMapel) return;
    updateSubject(editingMapel.id, namaMapelInput, kodeMapelInput);
    setEditingMapel(null);
    showToast(`Data mapel ${namaMapelInput} diperbarui.`);
  };

  const handleDeleteMapel = (m: Mapel) => {
    if (confirm(`Apakah Anda yakin ingin menghapus mata pelajaran ${m.nama_mapel}?`)) {
      deleteSubject(m.id);
      showToast(`Mapel ${m.nama_mapel} berhasil dihapus.`);
    }
  };

  const handleAssignTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningMapel || !selectedTeacherId || !selectedClassId) return;
    assignTeacherToClassMapel(selectedTeacherId, assigningMapel.id, selectedClassId);

    const teacherObj = teachers.find(t => t.id === selectedTeacherId);
    const classObj = kelas.find(k => k.id === selectedClassId);
    showToast(`${teacherObj?.nama} ditetapkan mengajar ${assigningMapel.nama_mapel} di Kelas ${classObj?.nama_kelas}.`);

    setSelectedTeacherId('');
    setSelectedClassId('');
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
            Mata Pelajaran & Pengajar
          </h2>
          <p className="text-xs text-slate-500">
            Kelola mata pelajaran dan tetapkan guru pengajar per kelas.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Mata Pelajaran</span>
        </button>
      </div>

      {/* Mapel List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {mapel.map(m => {
          const assignments = guruMapelKelas.filter(g => g.mapel_id === m.id);

          return (
            <div
              key={m.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 font-extrabold flex items-center justify-center text-sm">
                      {m.kode_mapel}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">{m.nama_mapel}</h3>
                      <p className="text-[11px] text-slate-400">Kode: {m.kode_mapel}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenEdit(m)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Edit Mapel"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMapel(m)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Hapus Mapel"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Assigned Teachers List */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mb-3 space-y-1.5 min-h-[70px]">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Pengajar Per Kelas:
                  </span>
                  {assignments.length === 0 ? (
                    <p className="text-[11px] text-slate-400 italic">Belum ada guru yang ditetapkan.</p>
                  ) : (
                    <div className="space-y-1">
                      {assignments.map(a => {
                        const teacherObj = teachers.find(t => t.id === a.guru_id);
                        const classObj = kelas.find(k => k.id === a.kelas_id);
                        return (
                          <div
                            key={a.id}
                            className="flex items-center justify-between bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-[11px]"
                          >
                            <span className="font-bold text-slate-800">
                              Kelas {classObj?.nama_kelas || '-'}:
                            </span>
                            <span className="text-slate-600 truncate max-w-[120px]">
                              {teacherObj?.nama || 'Guru'}
                            </span>
                            <button
                              onClick={() => removeTeacherFromClassMapel(a.id)}
                              className="text-rose-500 hover:text-rose-700 ml-1"
                              title="Hapus Penugasan"
                            >
                              &times;
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => setAssigningMapel(m)}
                className="w-full py-2 bg-slate-100 hover:bg-purple-50 hover:text-purple-700 font-bold text-slate-700 rounded-xl transition text-xs flex items-center justify-center space-x-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Plotting Guru & Kelas</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal Add/Edit Mapel */}
      {(isAddModalOpen || editingMapel) && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                {editingMapel ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran Baru'}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingMapel(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingMapel ? handleSaveEdit : handleSaveAdd} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Mata Pelajaran</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Matematika, Bahasa Indonesia..."
                  value={namaMapelInput}
                  onChange={e => setNamaMapelInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kode Mapel (Singkatan)</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: MAT, BIN, IPA..."
                  value={kodeMapelInput}
                  onChange={e => setKodeMapelInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none uppercase"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingMapel(null);
                  }}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow"
                >
                  Simpan Mapel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Assign Teacher to Class */}
      {assigningMapel && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                Plotting Pengajar ({assigningMapel.nama_mapel})
              </h3>
              <button onClick={() => setAssigningMapel(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignTeacher} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilih Guru Pengajar</label>
                <select
                  required
                  value={selectedTeacherId}
                  onChange={e => setSelectedTeacherId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="">-- Pilih Guru --</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilih Kelas</label>
                <select
                  required
                  value={selectedClassId}
                  onChange={e => setSelectedClassId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="">-- Pilih Kelas --</option>
                  {kelas.map(k => (
                    <option key={k.id} value={k.id}>
                      Kelas {k.nama_kelas}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setAssigningMapel(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl shadow"
                >
                  Tetapkan Pengajar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
