import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Tugas, FileAttachment } from '../../types';
import { X, Upload, Paperclip, AlertCircle, CheckCircle2 } from 'lucide-react';
import { validateFileUpload, fileToBase64, formatFileSize } from '../../utils/helpers';

interface SubmitTaskModalProps {
  task: Tugas;
  existingJawabanFile?: FileAttachment;
  onClose: () => void;
  onSuccess: () => void;
}

export const SubmitTaskModal: React.FC<SubmitTaskModalProps> = ({
  task,
  existingJawabanFile,
  onClose,
  onSuccess,
}) => {
  const { submitJawaban, mapel } = useApp();

  const mapelObj = mapel.find(m => m.id === task.mapel_id);

  const [jawabanFile, setJawabanFile] = useState<FileAttachment | undefined>(existingJawabanFile);
  const [catatan, setCatatan] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    const validation = validateFileUpload(file);
    if (!validation.valid) {
      setErrorMsg(validation.error || 'File tidak memenuhi syarat.');
      return;
    }

    try {
      setIsUploading(true);
      const base64 = await fileToBase64(file);
      setJawabanFile({
        nama: file.name,
        url: base64,
        size: file.size,
        type: file.type || 'application/octet-stream',
      });
    } catch {
      setErrorMsg('Gagal memproses file jawaban.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jawabanFile) {
      setErrorMsg('Harap pilih file jawaban terlebih dahulu.');
      return;
    }

    submitJawaban(task.id, jawabanFile, catatan);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase text-emerald-600">
              Pengumpulan Tugas {mapelObj?.nama_mapel}
            </span>
            <h3 className="font-bold text-slate-900 text-base">{task.judul}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-2 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* File Upload Dropzone */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <label className="block font-bold text-slate-800 mb-1">
              Unggah File Jawaban (PDF / Gambar / Doc, Maks 10 MB)
            </label>

            {jawabanFile ? (
              <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                <div className="flex items-center space-x-2 truncate">
                  <Paperclip className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-slate-800 truncate">{jawabanFile.nama}</span>
                  <span className="text-[10px] text-slate-400">({formatFileSize(jawabanFile.size)})</span>
                </div>
                <button
                  type="button"
                  onClick={() => setJawabanFile(undefined)}
                  className="text-rose-600 hover:text-rose-800 font-bold ml-2 text-xs"
                >
                  Ganti
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl cursor-pointer bg-white transition">
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <span className="font-bold text-slate-700">Pilih atau Seret Lembar Jawaban</span>
                <span className="text-[10px] text-slate-400 mt-1">
                  Mendukung PDF, PNG, JPG, Word (.docx), Excel (.xlsx), PowerPoint (.pptx)
                </span>
                <input type="file" onChange={handleFileChange} className="hidden" />
              </label>
            )}
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Catatan Untuk Guru (Opsional)
            </label>
            <textarea
              rows={2}
              placeholder="Tambahkan pesan atau penjelasan singkat mengenai jawaban Anda..."
              value={catatan}
              onChange={e => setCatatan(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

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
              disabled={!jawabanFile || isUploading}
              className={`px-5 py-2 font-bold rounded-xl shadow transition flex items-center space-x-1.5 ${
                jawabanFile && !isUploading
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isUploading ? 'Mengunggah...' : 'Kirimkan Jawaban'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
