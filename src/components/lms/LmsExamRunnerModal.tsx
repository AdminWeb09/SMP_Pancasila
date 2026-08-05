import React, { useState, useEffect } from 'react';
import { Tugas, User, FileAttachment } from '../../types';
import { getExamQuestionsForTask, CbtQuestion } from '../../data/cbtExamQuestions';
import {
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ChevronLeft,
  ChevronRight,
  Upload,
  Eye,
  Award,
  X,
  Lock,
  Flag,
  Check,
  Paperclip,
} from 'lucide-react';

interface LmsExamRunnerModalProps {
  task: Tugas;
  student: User;
  onClose: () => void;
  onSubmitExam: (file: FileAttachment, notes: string, autoScore?: number) => void;
}

export const LmsExamRunnerModal: React.FC<LmsExamRunnerModalProps> = ({
  task,
  student,
  onClose,
  onSubmitExam,
}) => {
  const questions = getExamQuestionsForTask(task.mapel_id);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [essayAnswers, setEssayAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [uploadedScratchpad, setUploadedScratchpad] = useState<FileAttachment | null>(null);

  // Timer countdown: default 60 minutes = 3600 seconds
  const [timeLeft, setTimeLeft] = useState<number>(3600);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<{
    autoScore: number;
    totalPg: number;
    correctPg: number;
    submissionTime: string;
  } | null>(null);

  // Timer effect
  useEffect(() => {
    if (isSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted]);

  const currentQuestion = questions[currentIndex];

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (qId: number, key: string) => {
    setAnswers(prev => ({ ...prev, [qId]: key }));
  };

  const handleEssayChange = (qId: number, text: string) => {
    setEssayAnswers(prev => ({ ...prev, [qId]: text }));
  };

  const toggleFlag = (qId: number) => {
    setFlagged(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  // Upload file scratchpad photo
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedScratchpad({
          nama: file.name,
          url: reader.result as string,
          size: file.size,
          type: file.type,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinalSubmit = () => {
    setIsSubmitting(true);

    // Calculate auto Pilihan Ganda score
    let pgCorrect = 0;
    let pgTotal = 0;

    questions.forEach(q => {
      if (q.tipe === 'pilihan_ganda') {
        pgTotal++;
        if (answers[q.id] === q.kunciJawaban) {
          pgCorrect++;
        }
      }
    });

    const pgScore = pgTotal > 0 ? Math.round((pgCorrect / pgTotal) * 100) : 100;
    const nowIso = new Date().toISOString();

    // Generate formatted text summary of essay answers
    let notesFormatted = `[LEMBAR JAWABAN CBT LMS ONLINE]\nWaktu Ujian: ${new Date().toLocaleString('id-ID')}\nSkor PG Otomatis: ${pgScore}/100 (${pgCorrect}/${pgTotal} Benar)\n\n--- RINCIAN ESSAY & CATATAN SISWA ---\n`;

    questions.forEach((q, idx) => {
      if (q.tipe === 'essay') {
        notesFormatted += `Soal #${idx + 1}: ${q.soal}\nJawaban: ${essayAnswers[q.id] || '(Tidak diisi)'}\n\n`;
      }
    });

    const mockFile: FileAttachment = uploadedScratchpad || {
      nama: `Lembar_Jawaban_CBT_${task.jenis.replace(/\s+/g, '_')}_${student.nama.replace(/\s+/g, '_')}.pdf`,
      url: 'data:application/pdf;base64,JVBERi0xLjQKJ...',
      size: 450000,
      type: 'application/pdf',
    };

    setTimeout(() => {
      onSubmitExam(mockFile, notesFormatted, pgScore);
      setSubmissionResult({
        autoScore: pgScore,
        totalPg: pgTotal,
        correctPg: pgCorrect,
        submissionTime: nowIso,
      });
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  const answeredCount = questions.filter(
    q => (q.tipe === 'pilihan_ganda' && answers[q.id]) || (q.tipe === 'essay' && essayAnswers[q.id]?.trim())
  ).length;

  const flaggedCount = Object.values(flagged).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col overflow-hidden animate-in fade-in duration-200">
      {/* Top Bar Navigation Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600 rounded-xl shadow-md text-white font-black text-xs tracking-wider">
            CBT LMS
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                SMP PANCASILA KRIAN
              </span>
              <span className="text-[10px] font-extrabold text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                {task.jenis} ({task.bobot_nilai}%)
              </span>
            </div>
            <h1 className="font-extrabold text-sm sm:text-base text-slate-100 mt-0.5">{task.judul}</h1>
          </div>
        </div>

        {/* Timer & Anti-Cheat Info */}
        <div className="flex items-center space-x-4">
          <div
            className={`px-3.5 py-1.5 rounded-xl border flex items-center space-x-2 shadow-inner font-mono text-sm font-bold ${
              timeLeft < 600
                ? 'bg-rose-950/80 text-rose-300 border-rose-800 animate-pulse'
                : 'bg-slate-800 text-emerald-400 border-slate-700'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Sisa Waktu: {formatTimer(timeLeft)}</span>
          </div>

          <div className="hidden lg:flex items-center space-x-1 text-[11px] text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700">
            <Lock className="w-3.5 h-3.5 text-blue-400" />
            <span>Mode Ujian Terkunci</span>
          </div>

          {!isSubmitted && (
            <button
              onClick={() => {
                if (confirm('Apakah Anda yakin ingin keluar dari ruang ujian CBT? Jawaban sementara akan disimpan.')) {
                  onClose();
                }
              }}
              className="p-2 bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-300 rounded-xl transition"
              title="Keluar Ruang Ujian"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      {!isSubmitted ? (
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left / Center Panel: Active Question */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-900 text-slate-100 flex flex-col justify-between">
            <div className="space-y-6 max-w-3xl mx-auto w-full">
              {/* Question Header Status */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-600 text-white font-black text-xs px-3 py-1 rounded-lg">
                    Soal No. {currentIndex + 1}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                    {currentQuestion.tipe === 'pilihan_ganda' ? 'Pilihan Ganda (A, B, C, D)' : 'Soal Essay / Uraian'}
                  </span>
                </div>

                <button
                  onClick={() => toggleFlag(currentQuestion.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold transition border ${
                    flagged[currentQuestion.id]
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-700'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>{flagged[currentQuestion.id] ? 'Ragu-Ragu (Aktif)' : 'Tandai Ragu-Ragu'}</span>
                </button>
              </div>

              {/* Question Body Text */}
              <div className="p-5 bg-slate-800/80 border border-slate-700/80 rounded-2xl shadow-sm text-sm sm:text-base leading-relaxed text-slate-100">
                <p className="whitespace-pre-line">{currentQuestion.soal}</p>
              </div>

              {/* Interactive Response Controls */}
              {currentQuestion.tipe === 'pilihan_ganda' ? (
                <div className="space-y-3 pt-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Pilih Jawaban Benar:</p>
                  <div className="grid grid-cols-1 gap-2.5">
                    {currentQuestion.pilihan?.map(opt => {
                      const isSelected = answers[currentQuestion.id] === opt.key;

                      return (
                        <button
                          key={opt.key}
                          onClick={() => handleSelectOption(currentQuestion.id, opt.key)}
                          className={`p-4 rounded-xl text-left text-sm font-medium transition flex items-center space-x-3 border ${
                            isSelected
                              ? 'bg-blue-600/20 border-blue-500 text-white shadow-md'
                              : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          <span
                            className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs border ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-400'
                                : 'bg-slate-700 text-slate-300 border-slate-600'
                            }`}
                          >
                            {opt.key}
                          </span>
                          <span className="flex-1">{opt.teks}</span>
                          {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Tuliskan Jawaban Uraian / Essay:</p>
                  <textarea
                    rows={6}
                    value={essayAnswers[currentQuestion.id] || ''}
                    onChange={e => handleEssayChange(currentQuestion.id, e.target.value)}
                    placeholder="Ketikkan uraian langkah penyelesaian atau penjelasan jawaban Anda di sini..."
                    className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500"
                  />
                </div>
              )}

              {/* Optional Photo/Scratchpad File Attachment */}
              <div className="pt-3 border-t border-slate-800">
                <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs space-y-0.5">
                    <p className="font-bold text-slate-200 flex items-center space-x-1.5">
                      <Paperclip className="w-3.5 h-3.5 text-blue-400" />
                      <span>Upload Lembar Oret-Oretan / Foto Jawaban (Opsional)</span>
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      Khusus soal matematika/hitung-hitungan, Anda bisa mengunggah foto lembar jawaban.
                    </p>
                  </div>

                  <label className="px-3.5 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-lg cursor-pointer transition flex items-center space-x-2 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadedScratchpad ? 'Ganti Foto' : 'Pilih File/Foto'}</span>
                    <input type="file" accept="image/*,application/pdf" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>

                {uploadedScratchpad && (
                  <div className="mt-2 text-xs text-emerald-400 font-semibold flex items-center space-x-1.5 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-800/60">
                    <Check className="w-3.5 h-3.5" />
                    <span>File Terlampir: {uploadedScratchpad.nama} ({Math.round(uploadedScratchpad.size / 1024)} KB)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Footer Navigation */}
            <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between max-w-3xl mx-auto w-full">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(prev => prev - 1)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 font-bold text-xs rounded-xl transition flex items-center space-x-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>

              <span className="text-xs text-slate-400 font-medium">
                {currentIndex + 1} dari {questions.length} Soal
              </span>

              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex(prev => prev + 1)}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1.5 shadow"
                >
                  <span>Selanjutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center space-x-2 shadow-lg animate-pulse"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Selesaikan & Kumpulkan Ujian</span>
                </button>
              )}
            </div>
          </main>

          {/* Right Sidebar: Student & Question Palette Grid */}
          <aside className="w-full md:w-80 bg-slate-950 border-t md:border-t-0 md:border-l border-slate-800 p-4 overflow-y-auto flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              {/* Student Identity Box */}
              <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-600/30 border border-blue-500 flex items-center justify-center font-black text-blue-300 text-sm shrink-0">
                  {student.nama.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-extrabold text-xs text-slate-200 truncate">{student.nama}</h4>
                  <p className="text-[10px] text-slate-400">NISN: {student.nip_nisn || '12345678'}</p>
                </div>
              </div>

              {/* Palette Stats Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-slate-300">Navigasi Soal CBT</span>
                  <span className="text-[11px] font-bold text-emerald-400">
                    {answeredCount}/{questions.length} Terisi
                  </span>
                </div>

                {/* Legend badges */}
                <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-400">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
                    <span>Sudah Terisi</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-amber-400"></span>
                    <span>Ragu-Ragu ({flaggedCount})</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-blue-600"></span>
                    <span>Soal Aktif</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-slate-800 border border-slate-700"></span>
                    <span>Belum Dijawab</span>
                  </div>
                </div>
              </div>

              {/* Questions Grid Palette */}
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, idx) => {
                  const isCurrent = idx === currentIndex;
                  const isAns =
                    (q.tipe === 'pilihan_ganda' && answers[q.id]) ||
                    (q.tipe === 'essay' && essayAnswers[q.id]?.trim());
                  const isFlg = flagged[q.id];

                  let bgClass = 'bg-slate-800 text-slate-400 hover:bg-slate-700 border-slate-700';

                  if (isFlg) {
                    bgClass = 'bg-amber-400 text-slate-950 font-extrabold border-amber-300';
                  } else if (isAns) {
                    bgClass = 'bg-emerald-600 text-white font-extrabold border-emerald-500';
                  }

                  if (isCurrent) {
                    bgClass += ' ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-950';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-10 rounded-xl font-bold text-xs transition flex items-center justify-center border shadow-sm ${bgClass}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Finish Button Sidebar */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <button
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl transition shadow-lg flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Kumpulkan Ujian Sekarang</span>
              </button>
              <p className="text-[10px] text-center text-slate-500">
                Nilai Pilihan Ganda akan dihitung otomatis oleh sistem LMS.
              </p>
            </div>
          </aside>
        </div>
      ) : (
        /* Exam Completion & Digital Receipt View */
        <div className="flex-1 flex items-center justify-center p-6 bg-slate-900 text-slate-100 overflow-y-auto">
          <div className="max-w-md w-full bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full mx-auto flex items-center justify-center border border-emerald-500/40">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
                Ujian CBT Berhasil Dikirung
              </span>
              <h2 className="text-xl font-black text-white pt-2">Bukti Pengumpulan LMS Ujian</h2>
              <p className="text-xs text-slate-400">SMP PANCASILA KRIAN — SIDOARJO</p>
            </div>

            {/* Score Summary Box */}
            <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-700 space-y-3 text-left">
              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-800">
                <span className="text-slate-400">Siswa / Peserta:</span>
                <span className="font-extrabold text-white">{student.nama}</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-800">
                <span className="text-slate-400">Ujian / Evaluasi:</span>
                <span className="font-bold text-amber-300">{task.judul}</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-800">
                <span className="text-slate-400">Skor PG Otomatis:</span>
                <span className="font-black text-emerald-400 text-sm">
                  {submissionResult?.autoScore} / 100 ({submissionResult?.correctPg}/{submissionResult?.totalPg} Benar)
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Waktu Terkirim:</span>
                <span className="font-mono text-[11px] text-slate-300">
                  {submissionResult ? new Date(submissionResult.submissionTime).toLocaleTimeString('id-ID') : '-'}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed italic">
              "Jawaban Pilihan Ganda telah dikoreksi otomatis oleh sistem LMS. Jawaban essay dan berkas lampiran telah diteruskan ke Guru Pengampu untuk penilaian akhir."
            </p>

            <button
              onClick={onClose}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition"
            >
              Tutup & Kembali ke Daftar Ujian
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
