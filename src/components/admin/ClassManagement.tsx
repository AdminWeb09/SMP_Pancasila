import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Kelas } from '../../types';
import { Plus, Edit, Trash2, Users, Building2, UserCheck, X, Check, Search } from 'lucide-react';

export const ClassManagement: React.FC = () => {
  const {
    kelas,
    users,
    addClass,
    updateClass,
    deleteClass,
    muridKelas,
    assignStudentToClass,
    removeStudentFromClass,
  } = useApp();

  const teachers = users.filter(u => u.role === 'guru');
  const students = users.filter(u => u.role === 'murid');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Kelas | null>(null);
  const [managingStudentsClass, setManagingStudentsClass] = useState<Kelas | null>(null);

  const [namaKelasInput, setNamaKelasInput] = useState('');
  const [waliKelasIdInput, setWaliKelasIdInput] = useState<string>('');
  const [studentSearchTerm, setStudentSearchTerm] = useState('');

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleOpenAdd = () => {
    setNamaKelasInput('');
    setWaliKelasIdInput('');
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaKelasInput) return;
    addClass(namaKelasInput, waliKelasIdInput || undefined);
    setIsAddModalOpen(false);
    showToast(`Kelas ${namaKelasInput} berhasil ditambahkan.`);
  };

  const handleOpenEdit = (kls: Kelas) => {
    setEditingClass(kls);
    setNamaKelasInput(kls.nama_kelas);
    setWaliKelasIdInput(kls.wali_kelas_id || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClass) return;
    updateClass(editingClass.id, namaKelasInput, waliKelasIdInput || undefined);
    setEditingClass(null);
    showToast(`Data kelas ${namaKelasInput} diperbarui.`);
  };

  const handleDeleteClass = (kls: Kelas) => {
    if (confirm(`Apakah Anda yakin ingin menghapus kelas ${kls.nama_kelas}?`)) {
      deleteClass(kls.id);
      showToast(`Kelas ${kls.nama_kelas} berhasil dihapus.`);
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
            Manajemen Kelas & Wali Kelas
          </h2>
          <p className="text-xs text-slate-500">
            Atur daftar kelas (7A, 7B, dll), tetapkan Wali Kelas, serta plotting murid terdaftar.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kelas Baru</span>
        </button>
      </div>

      {/* Grid of Classes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {kelas.map(kls => {
          const waliKelas = teachers.find(t => t.id === kls.wali_kelas_id);
          const classStudentsCount = muridKelas.filter(m => m.kelas_id === kls.id).length;

          return (
            <div
              key={kls.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center text-lg">
                      {kls.nama_kelas}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base">Kelas {kls.nama_kelas}</h3>
                      <p className="text-[11px] text-slate-400">SMP PANCASILA</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenEdit(kls)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Edit Wali Kelas"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClass(kls)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Hapus Kelas"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Wali Kelas Badge */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mb-3 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Wali Kelas
                  </span>
                  {waliKelas ? (
                    <div className="flex items-center space-x-2">
                      <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-bold text-xs text-slate-800 truncate">{waliKelas.nama}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-amber-600 font-semibold italic">Belum Ditentukan</span>
                  )}
                </div>
              </div>

              {/* Student stats & Manage button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1.5 text-slate-500">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>{classStudentsCount} Murid Terdaftar</span>
                </div>

                <button
                  onClick={() => setManagingStudentsClass(kls)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 font-bold text-slate-700 rounded-lg transition text-[11px]"
                >
                  Kelola Murid
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add / Edit Class */}
      {(isAddModalOpen || editingClass) && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                {editingClass ? `Edit Kelas ${editingClass.nama_kelas}` : 'Tambah Kelas Baru'}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingClass(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingClass ? handleSaveEdit : handleSaveAdd} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Kelas</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 7A, 7B, 8A..."
                  value={namaKelasInput}
                  onChange={e => setNamaKelasInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Wali Kelas (Pilih Guru)</label>
                <select
                  value={waliKelasIdInput}
                  onChange={e => setWaliKelasIdInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="">-- Belum Ditentukan --</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.nama} ({t.nip_nisn ? `NIP: ${t.nip_nisn}` : 'Guru'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingClass(null);
                  }}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow"
                >
                  Simpan Kelas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Manage Students in Class */}
      {managingStudentsClass && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Kelola Murid Kelas {managingStudentsClass.nama_kelas}
                </h3>
                <p className="text-xs text-slate-500">
                  Daftarkan atau keluarkan murid dari kelas {managingStudentsClass.nama_kelas}.
                </p>
              </div>
              <button
                onClick={() => setManagingStudentsClass(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari murid berdasarkan nama / NISN..."
                  value={studentSearchTerm}
                  onChange={e => setStudentSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {students
                .filter(
                  s =>
                    s.nama.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
                    (s.nip_nisn && s.nip_nisn.includes(studentSearchTerm))
                )
                .map(student => {
                  const currentClassRel = muridKelas.find(m => m.murid_id === student.id);
                  const isEnrolledHere = currentClassRel?.kelas_id === managingStudentsClass.id;
                  const otherClassObj = currentClassRel
                    ? kelas.find(k => k.id === currentClassRel.kelas_id)
                    : null;

                  return (
                    <div
                      key={student.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={student.foto_profil || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}
                          alt={student.nama}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{student.nama}</p>
                          <p className="text-[10px] text-slate-400">
                            NISN: {student.nip_nisn || '-'} |{' '}
                            {otherClassObj
                              ? `Terdaftar di Kelas ${otherClassObj.nama_kelas}`
                              : 'Belum Ada Kelas'}
                          </p>
                        </div>
                      </div>

                      {isEnrolledHere ? (
                        <button
                          onClick={() => {
                            removeStudentFromClass(student.id);
                            showToast(`${student.nama} dikeluarkan dari Kelas ${managingStudentsClass.nama_kelas}`);
                          }}
                          className="px-3 py-1.5 bg-rose-100 text-rose-800 hover:bg-rose-200 font-bold rounded-lg transition"
                        >
                          Keluarkan
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            assignStudentToClass(student.id, managingStudentsClass.id);
                            showToast(`${student.nama} didaftarkan ke Kelas ${managingStudentsClass.nama_kelas}`);
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition"
                        >
                          Daftarkan Ke {managingStudentsClass.nama_kelas}
                        </button>
                      )}
                    </div>
                  );
                })}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setManagingStudentsClass(null)}
                className="px-4 py-2 bg-emerald-700 text-white font-bold rounded-xl text-xs"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
