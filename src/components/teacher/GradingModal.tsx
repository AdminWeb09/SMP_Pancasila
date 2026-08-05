import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Jawaban } from '../../types';
import { X, Award, CheckCircle2, MessageSquare } from 'lucide-react';
import { getPredikatFromScore } from '../../utils/helpers';

interface GradingModalProps {
  submission: Jawaban;
  studentName: string;
  taskTitle: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const GradingModal: React.FC<GradingModalProps> = ({
  submission,
  studentName,
  taskTitle,
  onClose,
  onSuccess,
}) => {
  const { nilaiFeedback, gradeSubmission } = useApp();

  const existingNilai = nilaiFeedback.find(n => n.jawaban_id === submission.id);

  const [nilaiAngka, setNilaiAngka] = useState<number>(existingNilai ? existingNilai.nilai_angka : 85);
  const [predikat, setPredikat] = useState<string>(
    existingNilai ? existingNilai.predikat : getPredikatFromScore(85)
  );
  const [komentar, setKomentar] = useState<string>(
    existingNilai ? existingNilai.komentar_guru : 'Kerja bagus! Pertahankan semangat belajar.'
  );

  const handleScoreChange = (score: number) => {
    const valid = Math.min(100, Math.max(0, score));
    setNilaiAngka(valid);
    setPredikat(getPredikatFromScore(valid));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    gradeSubmission(submission.id, nilaiAngka, predikat, komentar);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-900 text-base">Input Nilai & Feedback</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 mb-4 space-y-1">
          <p>
            <span className="font-bold text-slate-900">Nama Murid:</span> {studentName}
          </p>
          <p className="truncate">
            <span className="font-bold text-slate-900">Tugas:</span> {taskTitle}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Nilai Angka (Skala 0 - 100)
            </label>
            <input
              type="number"
              min={0}
              max={100}
              required
              value={nilaiAngka}
              onChange={e => handleScoreChange(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-extrabold text-lg text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Predikat Capaian (Auto-derive / Override Manual)
            </label>
            <select
              value={predikat}
              onChange={e => setPredikat(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              <option value="Sangat Baik (A)">Sangat Baik (A)</option>
              <option value="Baik (B)">Baik (B)</option>
              <option value="Cukup (C)">Cukup (C)</option>
              <option value="Kurang (D)">Kurang (D)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center space-x-1">
              <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
              <span>Komentar & Evaluation Feedback Guru</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="Berikan masukan apresiatif atau poin koreksi untuk murid..."
              value={komentar}
              onChange={e => setKomentar(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
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
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow transition flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simpan & Kirim Nilai</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
