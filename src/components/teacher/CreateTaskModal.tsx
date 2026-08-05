import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Tugas, FileAttachment, SoalUlangan, TipeSoal } from '../../types';
import { X, Upload, FileText, AlertCircle, Check, Paperclip, Clock, Shuffle, Eye, Plus, Trash2, HelpCircle } from 'lucide-react';
import { validateFileUpload, fileToBase64, formatFileSize } from '../../utils/helpers';

interface CreateTaskModalProps {
  editingTask?: Tugas | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ editingTask, onClose, onSuccess }) => {
  const {
    currentUser,
    guruMapelKelas,
    kelas,
    mapel,
    createTask,
    updateTask,
    canTeacherUploadTask,
    getSoalForTask,
    saveSoalUlanganForTask,
  } = useApp();

  if (!currentUser) return null;

  // Get teacher's assigned mapel & class combinations
  const myAssignments = guruMapelKelas.filter(g => g.guru_id === currentUser.id);
  const defaultAssignment = myAssignments[0];

  const [judul, setJudul] = useState(editingTask ? editingTask.judul : '');
  const [deskripsi, setDeskripsi] = useState(editingTask ? editingTask.deskripsi : '');
  const [selectedMapelId, setSelectedMapelId] = useState(
    editingTask ? editingTask.mapel_id : defaultAssignment?.mapel_id || ''
  );
  const [selectedKelasId, setSelectedKelasId] = useState(
    editingTask ? editingTask.kelas_id : defaultAssignment?.kelas_id || ''
  );
  const [jenis, setJenis] = useState<Tugas['jenis']>(
    editingTask ? editingTask.jenis : 'Tugas Biasa'
  );
  const [bobotNilai, setBobotNilai] = useState<number>(
    editingTask ? editingTask.bobot_nilai : 20
  );
  const [deadline, setDeadline] = useState(
    editingTask
      ? new Date(editingTask.deadline).toISOString().slice(0, 16)
      : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
  );
  const [semester, setSemester] = useState(editingTask ? editingTask.semester : 'Ganjil 2025/2026');

  // CBT Exam Settings
  const [durasiMenit, setDurasiMenit] = useState<number>(editingTask?.durasi_menit ?? 45);
  const [maksPercobaan, setMaksPercobaan] = useState<number>(editingTask?.maks_percobaan ?? 1);
  const [acakSoal, setAcakSoal] = useState<boolean>(editingTask?.acak_urutan_soal ?? true);
  const [acakPilihan, setAcakPilihan] = useState<boolean>(editingTask?.acak_urutan_pilihan ?? true);
  const [tampilkanHasil, setTampilkanHasil] = useState<boolean>(
    editingTask?.tampilkan_hasil_setelah_selesai ?? true
  );

  // Bank Soal list for this exam
  const [examQuestions, setExamQuestions] = useState<SoalUlangan[]>(() => {
    if (editingTask && editingTask.jenis !== 'Tugas Biasa') {
      return getSoalForTask(editingTask.id, editingTask.mapel_id);
    }
    return [];
  });

  // New Question state
  const [newTipe, setNewTipe] = useState<TipeSoal>('pilihan_ganda');
  const [newTeks, setNewTeks] = useState('');
  const [newPilihanA, setNewPilihanA] = useState('');
  const [newPilihanB, setNewPilihanB] = useState('');
  const [newPilihanC, setNewPilihanC] = useState('');
  const [newPilihanD, setNewPilihanD] = useState('');
  const [newJawabanBenar, setNewJawabanBenar] = useState('A');
  const [newBobotPoin, setNewBobotPoin] = useState(25);

  const [activeTab, setActiveTab] = useState<'info' | 'cbt_settings' | 'bank_soal'>('info');

  const isExam = jenis !== 'Tugas Biasa';

  // Handle jenis change and suggest default weight
  const handleJenisChange = (newJenis: Tugas['jenis']) => {
    setJenis(newJenis);
    if (!editingTask) {
      if (newJenis === 'Tugas Biasa') setBobotNilai(20);
      else if (newJenis === 'Ulangan Harian') setBobotNilai(30);
      else if (newJenis === 'UTS') setBobotNilai(20);
      else if (newJenis === 'UAS') setBobotNilai(30);
    }
    if (newJenis !== 'Tugas Biasa' && examQuestions.length === 0) {
      // populate sample
      const dummyId = editingTask ? editingTask.id : `temp_${Date.now()}`;
      setExamQuestions(getSoalForTask(dummyId, selectedMapelId || 'default'));
    }
  };

  const [lampiran, setLampiran] = useState<FileAttachment | undefined>(
    editingTask ? editingTask.file_lampiran : undefined
  );

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Permission Check
  const isAllowedToUpload = canTeacherUploadTask(currentUser.id, selectedMapelId, selectedKelasId);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    const validation = validateFileUpload(file);
    if (!validation.valid) {
      setErrorMsg(validation.error || 'File tidak valid.');
      return;
    }

    try {
      setIsUploading(true);
      const base64 = await fileToBase64(file);
      setLampiran({
        nama: file.name,
        url: base64,
        size: file.size,
        type: file.type || 'application/octet-stream',
      });
    } catch {
      setErrorMsg('Gagal memproses file lampiran.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddQuestion = () => {
    if (!newTeks.trim()) {
      alert('Harap isi teks pertanyaan soal.');
      return;
    }

    if (newTipe === 'pilihan_ganda' && (!newPilihanA || !newPilihanB || !newPilihanC || !newPilihanD)) {
      alert('Harap isi 4 opsi pilihan ganda (A, B, C, D).');
      return;
    }

    let keyAnswer: string | undefined = undefined;
    if (newTipe === 'pilihan_ganda') {
      keyAnswer = newJawabanBenar || 'A';
    } else if (newTipe === 'benar_salah') {
      keyAnswer = newJawabanBenar === 'Salah' ? 'Salah' : 'Benar';
    } else {
      keyAnswer = undefined; // Essay has NO answer key!
    }

    const created: SoalUlangan = {
      id: `soal_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ulangan_id: editingTask?.id || '',
      tipe_soal: newTipe,
      teks_soal: newTeks,
      pilihan_jawaban:
        newTipe === 'pilihan_ganda'
          ? [
              { key: 'A', teks: newPilihanA },
              { key: 'B', teks: newPilihanB },
              { key: 'C', teks: newPilihanC },
              { key: 'D', teks: newPilihanD },
            ]
          : undefined,
      jawaban_benar: keyAnswer,
      bobot_poin: Number(newBobotPoin) || 20,
      urutan: examQuestions.length + 1,
    };

    setExamQuestions(prev => [...prev, created]);
    setNewTeks('');
    setNewPilihanA('');
    setNewPilihanB('');
    setNewPilihanC('');
    setNewPilihanD('');
  };

  const handleDeleteQuestion = (id: string) => {
    setExamQuestions(prev => prev.filter(q => q.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul || !deskripsi || !selectedMapelId || !selectedKelasId || !deadline) {
      setErrorMsg('Harap lengkapi seluruh formulir tugas.');
      return;
    }

    if (!isAllowedToUpload) {
      setErrorMsg('Anda tidak diizinkan oleh Admin untuk membuat tugas pada mapel/kelas ini.');
      return;
    }

    const taskPayload = {
      judul,
      deskripsi,
      guru_id: currentUser.id,
      mapel_id: selectedMapelId,
      kelas_id: selectedKelasId,
      jenis,
      bobot_nilai: Number(bobotNilai) || 20,
      deadline: new Date(deadline).toISOString(),
      semester,
      file_lampiran: lampiran,

      // CBT LMS Exam settings
      durasi_menit: isExam ? (Number(durasiMenit) || null) : undefined,
      maks_percobaan: isExam ? Number(maksPercobaan) || 1 : undefined,
      acak_urutan_soal: isExam ? acakSoal : undefined,
      acak_urutan_pilihan: isExam ? acakPilihan : undefined,
      tampilkan_hasil_setelah_selesai: isExam ? tampilkanHasil : undefined,
    };

    let targetTaskId = editingTask?.id;

    if (editingTask) {
      const res = updateTask({
        ...editingTask,
        ...taskPayload,
      });
      if (!res.success) {
        setErrorMsg(res.error || 'Gagal memperbarui tugas.');
        return;
      }
    } else {
      const res = createTask(taskPayload);
      if (!res.success) {
        setErrorMsg(res.error || 'Gagal membuat tugas baru.');
        return;
      }
    }

    // Save questions if it's an exam
    if (isExam && targetTaskId) {
      saveSoalUlanganForTask(targetTaskId, examQuestions);
    }

    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              {editingTask ? 'Edit Evaluasi Pembelajaran' : 'Buat Tugas / Ulangan Baru'}
            </h3>
            <p className="text-xs text-slate-500">
              SMP PANCASILA Krian Sidoarjo | Terbitkan Tugas Harian, Ulangan, UTS, atau UAS.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation if Exam Mode */}
        {isExam && (
          <div className="flex border-b border-slate-200 mt-3 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('info')}
              className={`px-4 py-2 border-b-2 transition ${
                activeTab === 'info'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Info & Jadwal
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('cbt_settings')}
              className={`px-4 py-2 border-b-2 transition flex items-center space-x-1.5 ${
                activeTab === 'cbt_settings'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Pengaturan CBT & Timer</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('bank_soal')}
              className={`px-4 py-2 border-b-2 transition flex items-center space-x-1.5 ${
                activeTab === 'bank_soal'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Bank Soal Exam ({examQuestions.length})</span>
            </button>
          </div>
        )}

        {/* Permission Alert if not allowed */}
        {!isAllowedToUpload && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-2 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              <strong>Izin Dibatasi:</strong> Admin sekolah belum memberikan izin upload untuk Anda pada mata pelajaran/kelas ini.
            </span>
          </div>
        )}

        {errorMsg && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-2 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs mt-4 overflow-y-auto flex-1 pr-1">
          {(!isExam || activeTab === 'info') && (
            <>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Tugas / Ulangan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ulangan Harian 1: Klasifikasi Makhluk Hidup"
                  value={judul}
                  onChange={e => setJudul(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jenis Entri / Evaluasi</label>
                  <select
                    required
                    value={jenis}
                    onChange={e => handleJenisChange(e.target.value as Tugas['jenis'])}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Tugas Biasa">Tugas Biasa (Latihan/PR)</option>
                    <option value="Ulangan Harian">Ulangan Harian (CBT LMS)</option>
                    <option value="UTS">Ujian Tengah Semester / UTS (CBT LMS)</option>
                    <option value="UAS">Ujian Akhir Semester / UAS (CBT LMS)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Bobot Kontribusi Nilai Akhir (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      required
                      value={bobotNilai}
                      onChange={e => setBobotNilai(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none pr-8"
                    />
                    <span className="absolute right-3 top-2 text-slate-400 font-bold">%</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kelas Tujuan</label>
                  <select
                    required
                    value={selectedKelasId}
                    onChange={e => setSelectedKelasId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {myAssignments.length === 0 ? (
                      <option value="">Belum Ada Kelas Diplot</option>
                    ) : (
                      Array.from(new Set(myAssignments.map(a => a.kelas_id))).map(kId => {
                        const classObj = kelas.find(k => k.id === kId);
                        return (
                          <option key={kId} value={kId}>
                            Kelas {classObj?.nama_kelas || kId}
                          </option>
                        );
                      })
                    )}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mata Pelajaran</label>
                  <select
                    required
                    value={selectedMapelId}
                    onChange={e => setSelectedMapelId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {myAssignments.length === 0 ? (
                      <option value="">Belum Ada Mapel Diplot</option>
                    ) : (
                      Array.from(new Set(myAssignments.map(a => a.mapel_id))).map(mId => {
                        const mapelObj = mapel.find(m => m.id === mId);
                        return (
                          <option key={mId} value={mId}>
                            {mapelObj?.nama_mapel || mId}
                          </option>
                        );
                      })
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Instruksi & Deskripsi</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tuliskan petunjuk pengerjaan tugas/ulangan secara jelas..."
                  value={deskripsi}
                  onChange={e => setDeskripsi(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Batas Waktu (Deadline)</label>
                  <input
                    type="datetime-local"
                    required
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Semester / Tahun Ajaran</label>
                  <input
                    type="text"
                    required
                    value={semester}
                    onChange={e => setSemester(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* File Attachment */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <label className="block font-bold text-slate-800 mb-1">
                  Lampiran Berkas Soal / Pendukung (Maks 10 MB)
                </label>

                {lampiran ? (
                  <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                    <div className="flex items-center space-x-2 truncate">
                      <Paperclip className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-semibold text-slate-800 truncate">{lampiran.nama}</span>
                      <span className="text-[10px] text-slate-400">({formatFileSize(lampiran.size)})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLampiran(undefined)}
                      className="text-rose-600 hover:text-rose-800 font-bold ml-2 text-xs"
                    >
                      Hapus
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl cursor-pointer bg-white transition">
                    <Upload className="w-5 h-5 text-slate-400 mb-1" />
                    <span className="font-semibold text-slate-700">Pilih / Unggah Lampiran</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">PDF, Word, Excel, JPG, PNG</span>
                    <input type="file" onChange={handleFileChange} className="hidden" />
                  </label>
                )}
              </div>
            </>
          )}

          {/* CBT Settings Tab */}
          {isExam && activeTab === 'cbt_settings' && (
            <div className="space-y-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Pengaturan Mesin Ujian Online (CBT LMS)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Durasi Timer (Menit)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Contoh: 45 (Isi 0 jika tanpa batas timer)"
                    value={durasiMenit}
                    onChange={e => setDurasiMenit(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Kosongkan/0 jika ingin pengerjakan tanpa timer mundur.</p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Maksimal Percobaan Murid</label>
                  <select
                    value={maksPercobaan}
                    onChange={e => setMaksPercobaan(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value={1}>1 Kali Kesempatan (Standar Ujian)</option>
                    <option value={2}>2 Kali Kesempatan</option>
                    <option value={3}>3 Kali Kesempatan</option>
                    <option value={0}>Tidak Terbatas (Remidi / Latihan)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acakSoal}
                    onChange={e => setAcakSoal(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300"
                  />
                  <span className="font-bold text-slate-700">Acak Urutan Soal untuk Setiap Murid</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acakPilihan}
                    onChange={e => setAcakPilihan(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300"
                  />
                  <span className="font-bold text-slate-700">Acak Opsi Pilihan Jawaban (A, B, C, D)</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tampilkanHasil}
                    onChange={e => setTampilkanHasil(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300"
                  />
                  <span className="font-bold text-slate-700">Tampilkan Hasil & Kunci Jawaban Setelah Submit</span>
                </label>
              </div>
            </div>
          )}

          {/* Bank Soal Tab */}
          {isExam && activeTab === 'bank_soal' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-blue-900 text-sm flex items-center space-x-2">
                    <Plus className="w-4 h-4 text-blue-600" />
                    <span>Tambah Butir Soal Baru</span>
                  </h4>
                  <span className="text-[10px] text-blue-700 font-bold bg-blue-100 px-2.5 py-0.5 rounded-full">
                    Kunci Jawaban Wajib Diisi untuk PG & Benar-Salah
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tipe Soal</label>
                    <select
                      value={newTipe}
                      onChange={e => setNewTipe(e.target.value as TipeSoal)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                    >
                      <option value="pilihan_ganda">Pilihan Ganda (Opsi A, B, C, D)</option>
                      <option value="benar_salah">Benar / Salah</option>
                      <option value="essay">Essay / Uraian (Koreksi Manual Guru)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Bobot Poin Soal</label>
                    <input
                      type="number"
                      min="1"
                      value={newBobotPoin}
                      onChange={e => setNewBobotPoin(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Teks Pertanyaan Soal</label>
                  <textarea
                    rows={2}
                    placeholder="Tuliskan pertanyaan soal..."
                    value={newTeks}
                    onChange={e => setNewTeks(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  />
                </div>

                {newTipe === 'pilihan_ganda' && (
                  <div className="space-y-2 bg-white p-3 rounded-xl border border-slate-200">
                    <p className="font-bold text-slate-800 text-[11px]">Opsi Pilihan Jawaban & Kunci Jawaban:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Opsi A"
                        value={newPilihanA}
                        onChange={e => setNewPilihanA(e.target.value)}
                        className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Opsi B"
                        value={newPilihanB}
                        onChange={e => setNewPilihanB(e.target.value)}
                        className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Opsi C"
                        value={newPilihanC}
                        onChange={e => setNewPilihanC(e.target.value)}
                        className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Opsi D"
                        value={newPilihanD}
                        onChange={e => setNewPilihanD(e.target.value)}
                        className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-1">
                      <span className="font-bold text-slate-700 text-xs">Pilih Kunci Jawaban Benar:</span>
                      <select
                        value={newJawabanBenar}
                        onChange={e => setNewJawabanBenar(e.target.value)}
                        className="px-3 py-1 border border-blue-400 font-bold text-blue-900 rounded-lg text-xs bg-blue-50"
                      >
                        <option value="A">Opsi A</option>
                        <option value="B">Opsi B</option>
                        <option value="C">Opsi C</option>
                        <option value="D">Opsi D</option>
                      </select>
                    </div>
                  </div>
                )}

                {newTipe === 'benar_salah' && (
                  <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs">Pilih Kunci Jawaban Benar:</span>
                    <select
                      value={newJawabanBenar}
                      onChange={e => setNewJawabanBenar(e.target.value)}
                      className="px-3 py-1 border border-blue-400 font-bold text-blue-900 rounded-lg text-xs bg-blue-50"
                    >
                      <option value="Benar">Pernyataan BENAR</option>
                      <option value="Salah">Pernyataan SALAH</option>
                    </select>
                  </div>
                )}

                {newTipe === 'essay' && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900">
                    <strong>Catatan Soal Essay:</strong> Soal essay tidak memerlukan kunci jawaban otomatis. Hasil pengerjaan essay murid akan menunggu koreksi manual dari Anda di halaman Penilaian Guru.
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambahkan Soal Ini ke Bank Soal</span>
                </button>
              </div>

              {/* List of current questions */}
              <div className="space-y-2">
                <h5 className="font-bold text-slate-800 text-xs">Daftar Soal Terdaftar ({examQuestions.length} Soal)</h5>
                {examQuestions.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Belum ada butir soal. Silakan buat soal di atas.</p>
                ) : (
                  examQuestions.map((q, idx) => (
                    <div key={q.id || idx} className="p-3 bg-white border border-slate-200 rounded-xl flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-blue-600 text-xs">Soal #{idx + 1}</span>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-slate-100 rounded-full text-slate-600">
                            {q.tipe_soal.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-600">({q.bobot_poin} Poin)</span>
                        </div>
                        <p className="text-xs font-semibold text-slate-800">{q.teks_soal}</p>
                        {q.jawaban_benar && (
                          <p className="text-[10px] font-bold text-blue-700">Kunci Jawaban: {q.jawaban_benar}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="text-rose-500 hover:text-rose-700 p-1 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!isAllowedToUpload || isUploading}
              className={`px-5 py-2 font-bold rounded-xl shadow transition ${
                isAllowedToUpload && !isUploading
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isUploading ? 'Memproses File...' : editingTask ? 'Simpan Perubahan' : isExam ? 'Terbitkan Ujian CBT' : 'Terbitkan Tugas'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

