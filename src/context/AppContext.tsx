import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Kelas,
  Mapel,
  GuruMapelKelas,
  MuridKelas,
  GuruIzinUpload,
  Tugas,
  Jawaban,
  NilaiFeedback,
  Notifikasi,
  FileAttachment,
  SoalUlangan,
  PercobaanUlangan,
  JawabanSoal
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_KELAS,
  INITIAL_MAPEL,
  INITIAL_GURU_MAPEL_KELAS,
  INITIAL_MURID_KELAS,
  INITIAL_GURU_IZIN_UPLOAD,
  INITIAL_TUGAS,
  INITIAL_JAWABAN,
  INITIAL_NILAI_FEEDBACK,
  INITIAL_NOTIFIKASI,
  INITIAL_SOAL_ULANGAN,
  INITIAL_PERCOBAAN_ULANGAN,
  INITIAL_JAWABAN_SOAL
} from '../data/initialData';
import { isDeadlinePassed } from '../utils/helpers';
import { getExamQuestionsForTask } from '../data/cbtExamQuestions';

interface AppContextType {
  currentUser: User | null;
  login: (email: string, pass: string) => { success: boolean; message?: string };
  logout: () => void;
  switchUser: (userId: string) => void;
  
  users: User[];
  kelas: Kelas[];
  mapel: Mapel[];
  guruMapelKelas: GuruMapelKelas[];
  muridKelas: MuridKelas[];
  guruIzinUpload: GuruIzinUpload[];
  tugas: Tugas[];
  jawaban: Jawaban[];
  nilaiFeedback: NilaiFeedback[];
  notifikasi: Notifikasi[];

  // CBT LMS Exam Bank Soal & Attempts
  soalUlangan: SoalUlangan[];
  percobaanUlangan: PercobaanUlangan[];
  jawabanSoal: JawabanSoal[];
  getSoalForTask: (taskId: string, mapelId: string) => SoalUlangan[];
  saveSoalUlanganForTask: (taskId: string, questions: SoalUlangan[]) => void;
  addSoalUlangan: (question: Omit<SoalUlangan, 'id'>) => void;
  updateSoalUlangan: (question: SoalUlangan) => void;
  deleteSoalUlangan: (id: string) => void;
  submitPercobaanUlangan: (
    ulanganId: string,
    muridId: string,
    responses: { soalId: string; jawaban: string }[],
    waktuMulai: string
  ) => PercobaanUlangan;
  gradeEssayPercobaan: (
    percobaanId: string,
    essayScores: { soalId: string; poin: number }[],
    komentarGuru: string
  ) => void;

  // Admin Actions
  addUser: (user: Omit<User, 'id'>) => User;
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;
  resetUserPassword: (id: string, newPass: string) => void;
  
  addClass: (namaKelas: string, waliKelasId?: string) => void;
  updateClass: (id: string, namaKelas: string, waliKelasId?: string) => void;
  deleteClass: (id: string) => void;
  
  addSubject: (namaMapel: string, kodeMapel: string) => void;
  updateSubject: (id: string, namaMapel: string, kodeMapel: string) => void;
  deleteSubject: (id: string) => void;
  
  assignTeacherToClassMapel: (guruId: string, mapelId: string, kelasId: string) => void;
  removeTeacherFromClassMapel: (id: string) => void;
  
  assignStudentToClass: (muridId: string, kelasId: string) => void;
  removeStudentFromClass: (muridId: string) => void;
  
  toggleTeacherUploadPermission: (guruId: string, mapelId: string, kelasId: string, diizinkan: boolean) => void;
  canTeacherUploadTask: (guruId: string, mapelId: string, kelasId: string) => boolean;

  // Teacher Actions
  createTask: (data: Omit<Tugas, 'id' | 'tanggal_dibuat'>) => { success: boolean; error?: string };
  updateTask: (task: Tugas) => { success: boolean; error?: string };
  deleteTask: (id: string) => void;
  gradeSubmission: (jawabanId: string, nilaiAngka: number, predikat: string, komentarGuru: string) => void;

  // Student Actions
  submitJawaban: (tugasId: string, fileAttachment: FileAttachment, catatanMurid?: string) => void;

  // Notification Actions
  markNotifAsRead: (id: string) => void;
  markAllNotifAsRead: () => void;

  // System Utility
  resetSystemData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'smppancasila_app_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from LocalStorage or default
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_currentUser`);
    return saved ? JSON.parse(saved) : INITIAL_USERS[0]; // Default to Admin
  });

  const [kelas, setKelas] = useState<Kelas[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_kelas`);
    return saved ? JSON.parse(saved) : INITIAL_KELAS;
  });

  const [mapel, setMapel] = useState<Mapel[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_mapel`);
    return saved ? JSON.parse(saved) : INITIAL_MAPEL;
  });

  const [guruMapelKelas, setGuruMapelKelas] = useState<GuruMapelKelas[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_guruMapelKelas`);
    return saved ? JSON.parse(saved) : INITIAL_GURU_MAPEL_KELAS;
  });

  const [muridKelas, setMuridKelas] = useState<MuridKelas[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_muridKelas`);
    return saved ? JSON.parse(saved) : INITIAL_MURID_KELAS;
  });

  const [guruIzinUpload, setGuruIzinUpload] = useState<GuruIzinUpload[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_guruIzinUpload`);
    return saved ? JSON.parse(saved) : INITIAL_GURU_IZIN_UPLOAD;
  });

  const [tugas, setTugas] = useState<Tugas[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_tugas`);
    return saved ? JSON.parse(saved) : INITIAL_TUGAS;
  });

  const [jawaban, setJawaban] = useState<Jawaban[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_jawaban`);
    return saved ? JSON.parse(saved) : INITIAL_JAWABAN;
  });

  const [nilaiFeedback, setNilaiFeedback] = useState<NilaiFeedback[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_nilaiFeedback`);
    return saved ? JSON.parse(saved) : INITIAL_NILAI_FEEDBACK;
  });

  const [notifikasi, setNotifikasi] = useState<Notifikasi[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_notifikasi`);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFIKASI;
  });

  const [soalUlangan, setSoalUlangan] = useState<SoalUlangan[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_soalUlangan`);
    return saved ? JSON.parse(saved) : INITIAL_SOAL_ULANGAN;
  });

  const [percobaanUlangan, setPercobaanUlangan] = useState<PercobaanUlangan[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_percobaanUlangan`);
    return saved ? JSON.parse(saved) : INITIAL_PERCOBAAN_ULANGAN;
  });

  const [jawabanSoal, setJawabanSoal] = useState<JawabanSoal[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_jawabanSoal`);
    return saved ? JSON.parse(saved) : INITIAL_JAWABAN_SOAL;
  });

  // Sync state changes to LocalStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_soalUlangan`, JSON.stringify(soalUlangan));
  }, [soalUlangan]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_percobaanUlangan`, JSON.stringify(percobaanUlangan));
  }, [percobaanUlangan]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_jawabanSoal`, JSON.stringify(jawabanSoal));
  }, [jawabanSoal]);

  // Sync state changes to LocalStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`${STORAGE_KEY}_currentUser`, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(`${STORAGE_KEY}_currentUser`);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_kelas`, JSON.stringify(kelas));
  }, [kelas]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_mapel`, JSON.stringify(mapel));
  }, [mapel]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_guruMapelKelas`, JSON.stringify(guruMapelKelas));
  }, [guruMapelKelas]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_muridKelas`, JSON.stringify(muridKelas));
  }, [muridKelas]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_guruIzinUpload`, JSON.stringify(guruIzinUpload));
  }, [guruIzinUpload]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_tugas`, JSON.stringify(tugas));
  }, [tugas]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_jawaban`, JSON.stringify(jawaban));
  }, [jawaban]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_nilaiFeedback`, JSON.stringify(nilaiFeedback));
  }, [nilaiFeedback]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_notifikasi`, JSON.stringify(notifikasi));
  }, [notifikasi]);

  // Auth Methods
  const login = (email: string, pass: string) => {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      return { success: false, message: 'Email tidak terdaftar di sistem SMP PANCASILA.' };
    }
    if (found.password && found.password !== pass) {
      return { success: false, message: 'Kata sandi tidak sesuai.' };
    }
    setCurrentUser(found);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
    }
  };

  // Helper Check Permission
  const canTeacherUploadTask = (guruId: string, mapelId: string, kelasId: string): boolean => {
    const permission = guruIzinUpload.find(
      p => p.guru_id === guruId && p.mapel_id === mapelId && p.kelas_id === kelasId
    );
    // If explicitly set, return diizinkan; default to true if assigned unless restricted
    return permission ? permission.diizinkan : true;
  };

  // Admin Actions
  const addUser = (userData: Omit<User, 'id'>): User => {
    const newUser: User = {
      ...userData,
      id: `usr_${Date.now()}`,
      password: userData.password || 'password123',
    };
    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  const updateUser = (updated: User) => {
    setUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)));
    if (currentUser && currentUser.id === updated.id) {
      setCurrentUser(updated);
    }
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    if (currentUser && currentUser.id === id) {
      setCurrentUser(null);
    }
  };

  const resetUserPassword = (id: string, newPass: string) => {
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, password: newPass } : u)));
  };

  const addClass = (namaKelas: string, waliKelasId?: string) => {
    const newKelas: Kelas = {
      id: `kls_${Date.now()}`,
      nama_kelas: namaKelas,
      wali_kelas_id: waliKelasId,
    };
    setKelas(prev => [...prev, newKelas]);
  };

  const updateClass = (id: string, namaKelas: string, waliKelasId?: string) => {
    setKelas(prev => prev.map(k => (k.id === id ? { ...k, nama_kelas: namaKelas, wali_kelas_id: waliKelasId } : k)));
  };

  const deleteClass = (id: string) => {
    setKelas(prev => prev.filter(k => k.id !== id));
  };

  const addSubject = (namaMapel: string, kodeMapel: string) => {
    const newMapel: Mapel = {
      id: `mpl_${Date.now()}`,
      nama_mapel: namaMapel,
      kode_mapel: kodeMapel.toUpperCase(),
    };
    setMapel(prev => [...prev, newMapel]);
  };

  const updateSubject = (id: string, namaMapel: string, kodeMapel: string) => {
    setMapel(prev => prev.map(m => (m.id === id ? { ...m, nama_mapel: namaMapel, kode_mapel: kodeMapel.toUpperCase() } : m)));
  };

  const deleteSubject = (id: string) => {
    setMapel(prev => prev.filter(m => m.id !== id));
  };

  const assignTeacherToClassMapel = (guruId: string, mapelId: string, kelasId: string) => {
    const exists = guruMapelKelas.some(g => g.guru_id === guruId && g.mapel_id === mapelId && g.kelas_id === kelasId);
    if (!exists) {
      const newGmk: GuruMapelKelas = {
        id: `gmk_${Date.now()}`,
        guru_id: guruId,
        mapel_id: mapelId,
        kelas_id: kelasId,
      };
      setGuruMapelKelas(prev => [...prev, newGmk]);

      // Ensure permission record exists and is set to true
      setGuruIzinUpload(prev => {
        const pExists = prev.some(p => p.guru_id === guruId && p.mapel_id === mapelId && p.kelas_id === kelasId);
        if (!pExists) {
          return [
            ...prev,
            {
              id: `gi_${Date.now()}`,
              guru_id: guruId,
              mapel_id: mapelId,
              kelas_id: kelasId,
              diizinkan: true,
            }
          ];
        }
        return prev;
      });
    }
  };

  const removeTeacherFromClassMapel = (id: string) => {
    setGuruMapelKelas(prev => prev.filter(g => g.id !== id));
  };

  const assignStudentToClass = (muridId: string, kelasId: string) => {
    setMuridKelas(prev => {
      const filtered = prev.filter(m => m.murid_id !== muridId);
      return [...filtered, { id: `mk_${Date.now()}`, murid_id: muridId, kelas_id: kelasId }];
    });
  };

  const removeStudentFromClass = (muridId: string) => {
    setMuridKelas(prev => prev.filter(m => m.murid_id !== muridId));
  };

  const toggleTeacherUploadPermission = (guruId: string, mapelId: string, kelasId: string, diizinkan: boolean) => {
    setGuruIzinUpload(prev => {
      const existing = prev.find(p => p.guru_id === guruId && p.mapel_id === mapelId && p.kelas_id === kelasId);
      if (existing) {
        return prev.map(p => (p.id === existing.id ? { ...p, diizinkan } : p));
      } else {
        return [
          ...prev,
          {
            id: `gi_${Date.now()}`,
            guru_id: guruId,
            mapel_id: mapelId,
            kelas_id: kelasId,
            diizinkan,
          }
        ];
      }
    });
  };

  // Teacher Task Actions
  const createTask = (data: Omit<Tugas, 'id' | 'tanggal_dibuat'>) => {
    // Check upload permission
    const allowed = canTeacherUploadTask(data.guru_id, data.mapel_id, data.kelas_id);
    if (!allowed) {
      return {
        success: false,
        error: 'Anda tidak diizinkan oleh Admin untuk mengunggah/membuat tugas pada mata pelajaran & kelas ini.',
      };
    }

    const newTask: Tugas = {
      ...data,
      id: `tgs_${Date.now()}`,
      tanggal_dibuat: new Date().toISOString(),
    };

    setTugas(prev => [newTask, ...prev]);

    // Send in-app notification to all students in that class!
    const studentInClass = muridKelas.filter(mk => mk.kelas_id === data.kelas_id).map(mk => mk.murid_id);
    const mapelObj = mapel.find(m => m.id === data.mapel_id);
    const teacherObj = users.find(u => u.id === data.guru_id);

    const newNotifs: Notifikasi[] = studentInClass.map(sId => ({
      id: `ntf_${Date.now()}_${sId}`,
      user_id: sId,
      jenis: 'tugas_baru',
      pesan: `Tugas Baru [${mapelObj?.nama_mapel || 'Mapel'}]: "${data.judul}" telah diunggah oleh ${teacherObj?.nama || 'Guru'}. Deadline: ${new Date(data.deadline).toLocaleDateString('id-ID')}`,
      sudah_dibaca: false,
      tanggal: new Date().toISOString(),
      link_id: newTask.id,
    }));

    setNotifikasi(prev => [...newNotifs, ...prev]);

    return { success: true };
  };

  const updateTask = (task: Tugas) => {
    setTugas(prev => prev.map(t => (t.id === task.id ? task : t)));
    return { success: true };
  };

  const deleteTask = (id: string) => {
    setTugas(prev => prev.filter(t => t.id !== id));
    // clean up associated submissions
    setJawaban(prev => prev.filter(j => j.tugas_id !== id));
  };

  const gradeSubmission = (jawabanId: string, nilaiAngka: number, predikat: string, komentarGuru: string) => {
    const targetJawaban = jawaban.find(j => j.id === jawabanId);
    if (!targetJawaban) return;

    // Add or update NilaiFeedback
    const existingNilai = nilaiFeedback.find(n => n.jawaban_id === jawabanId);
    const newNilai: NilaiFeedback = {
      id: existingNilai ? existingNilai.id : `nl_${Date.now()}`,
      jawaban_id: jawabanId,
      nilai_angka: nilaiAngka,
      predikat: predikat,
      komentar_guru: komentarGuru,
      tanggal_dinilai: new Date().toISOString(),
    };

    if (existingNilai) {
      setNilaiFeedback(prev => prev.map(n => (n.id === existingNilai.id ? newNilai : n)));
    } else {
      setNilaiFeedback(prev => [...prev, newNilai]);
    }

    // Update submission status
    setJawaban(prev =>
      prev.map(j => (j.id === jawabanId ? { ...j, status: 'sudah_dinilai' } : j))
    );

    // Notify student
    const targetTask = tugas.find(t => t.id === targetJawaban.tugas_id);
    const teacherUser = currentUser;

    const notif: Notifikasi = {
      id: `ntf_${Date.now()}`,
      user_id: targetJawaban.murid_id,
      jenis: 'nilai_masuk',
      pesan: `Nilai & Feedback keluar untuk tugas "${targetTask?.judul || 'Tugas'}" dari ${teacherUser?.nama || 'Guru'}. Nilai: ${nilaiAngka} (${predikat})`,
      sudah_dibaca: false,
      tanggal: new Date().toISOString(),
      link_id: targetTask?.id,
    };

    setNotifikasi(prev => [notif, ...prev]);
  };

  // Student Actions
  const submitJawaban = (tugasId: string, fileAttachment: FileAttachment, catatanMurid?: string) => {
    if (!currentUser) return;

    const targetTask = tugas.find(t => t.id === tugasId);
    const isLate = targetTask ? isDeadlinePassed(targetTask.deadline) : false;

    // Check if student already submitted
    const existingJawaban = jawaban.find(j => j.tugas_id === tugasId && j.murid_id === currentUser.id);

    const newSubmission: Jawaban = {
      id: existingJawaban ? existingJawaban.id : `jwb_${Date.now()}`,
      tugas_id: tugasId,
      murid_id: currentUser.id,
      file_jawaban: fileAttachment,
      catatan_murid: catatanMurid,
      waktu_upload: new Date().toISOString(),
      status: existingJawaban && existingJawaban.status === 'sudah_dinilai' ? 'sudah_dinilai' : (isLate ? 'terlambat' : 'belum_dinilai'),
    };

    if (existingJawaban) {
      setJawaban(prev => prev.map(j => (j.id === existingJawaban.id ? newSubmission : j)));
    } else {
      setJawaban(prev => [...prev, newSubmission]);
    }

    // Notify teacher
    if (targetTask) {
      const notifTeacher: Notifikasi = {
        id: `ntf_${Date.now()}`,
        user_id: targetTask.guru_id,
        jenis: 'jawaban_masuk',
        pesan: `${currentUser.nama} telah mengumpulkan jawaban untuk "${targetTask.judul}" ${isLate ? '(Terlambat)' : ''}.`,
        sudah_dibaca: false,
        tanggal: new Date().toISOString(),
        link_id: targetTask.id,
      };
      setNotifikasi(prev => [notifTeacher, ...prev]);
    }
  };

  // Notifications
  const markNotifAsRead = (id: string) => {
    setNotifikasi(prev => prev.map(n => (n.id === id ? { ...n, sudah_dibaca: true } : n)));
  };

  const markAllNotifAsRead = () => {
    if (!currentUser) return;
    setNotifikasi(prev =>
      prev.map(n => (n.user_id === currentUser.id ? { ...n, sudah_dibaca: true } : n))
    );
  };

  // CBT LMS Question & Attempt Actions
  const getSoalForTask = (taskId: string, mapelId: string): SoalUlangan[] => {
    const existing = soalUlangan.filter(s => s.ulangan_id === taskId);
    if (existing.length > 0) return existing;
    return getExamQuestionsForTask(taskId, mapelId);
  };

  const saveSoalUlanganForTask = (taskId: string, questions: SoalUlangan[]) => {
    setSoalUlangan(prev => {
      const filtered = prev.filter(s => s.ulangan_id !== taskId);
      return [...filtered, ...questions];
    });
  };

  const addSoalUlangan = (question: Omit<SoalUlangan, 'id'>) => {
    const newQ: SoalUlangan = {
      ...question,
      id: `soal_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    setSoalUlangan(prev => [...prev, newQ]);
  };

  const updateSoalUlangan = (updated: SoalUlangan) => {
    setSoalUlangan(prev => prev.map(s => (s.id === updated.id ? updated : s)));
  };

  const deleteSoalUlangan = (id: string) => {
    setSoalUlangan(prev => prev.filter(s => s.id !== id));
  };

  const submitPercobaanUlangan = (
    ulanganId: string,
    muridId: string,
    responses: { soalId: string; jawaban: string }[],
    waktuMulai: string
  ): PercobaanUlangan => {
    const targetTask = tugas.find(t => t.id === ulanganId);
    const questions = getSoalForTask(ulanganId, targetTask?.mapel_id || 'default');

    let totalObjPoinTarget = 0;
    let totalObjPoinDiperoleh = 0;
    let hasEssay = false;

    const newJawabanSoal: JawabanSoal[] = [];

    questions.forEach(q => {
      const resp = responses.find(r => r.soalId === q.id);
      const studentAns = resp ? resp.jawaban : '';

      if (q.tipe_soal === 'pilihan_ganda' || q.tipe_soal === 'benar_salah') {
        totalObjPoinTarget += q.bobot_poin || 20;
        const isCorrect = q.jawaban_benar && studentAns && studentAns.trim().toLowerCase() === q.jawaban_benar.trim().toLowerCase();
        const earned = isCorrect ? (q.bobot_poin || 20) : 0;
        totalObjPoinDiperoleh += earned;

        newJawabanSoal.push({
          id: `jsoal_${Date.now()}_${q.id}`,
          percobaan_id: '', // Will set below
          soal_id: q.id,
          jawaban_murid: studentAns,
          benar: Boolean(isCorrect),
          poin_diperoleh: earned,
        });
      } else {
        hasEssay = true;
        // Essay has NO auto-grading; answer_benar is null
        newJawabanSoal.push({
          id: `jsoal_${Date.now()}_${q.id}`,
          percobaan_id: '',
          soal_id: q.id,
          jawaban_murid: studentAns,
          benar: null, // Null for essay
          poin_diperoleh: 0,
        });
      }
    });

    // Scale auto score to 0 - 100 based on objective questions
    const nilaiOtomatis = totalObjPoinTarget > 0 ? Math.round((totalObjPoinDiperoleh / totalObjPoinTarget) * 100) : 0;

    const previousAttempts = percobaanUlangan.filter(p => p.ulangan_id === ulanganId && p.murid_id === muridId);
    const attemptNo = previousAttempts.length + 1;

    const newAttemptId = `prc_${Date.now()}`;
    const newAttempt: PercobaanUlangan = {
      id: newAttemptId,
      ulangan_id: ulanganId,
      murid_id: muridId,
      percobaan_ke: attemptNo,
      waktu_mulai: waktuMulai,
      waktu_selesai: new Date().toISOString(),
      status: 'selesai',
      status_pemeriksaan: hasEssay ? 'menunggu_pemeriksaan_guru' : 'otomatis_selesai',
      nilai_otomatis: nilaiOtomatis,
      nilai_manual: hasEssay ? undefined : 0,
      nilai_total: hasEssay ? undefined : nilaiOtomatis,
    };

    // Update percobaan id in responses
    const finalJawabanSoal = newJawabanSoal.map(j => ({ ...j, percobaan_id: newAttemptId }));

    setPercobaanUlangan(prev => [...prev, newAttempt]);
    setJawabanSoal(prev => [...prev, ...finalJawabanSoal]);

    // Link/Sync to standard submission record Jawaban & NilaiFeedback
    const existingSub = jawaban.find(j => j.tugas_id === ulanganId && j.murid_id === muridId);
    const cbtFile: FileAttachment = {
      nama: `Lembar_Jawaban_CBT_Ke_${attemptNo}.cbt`,
      url: `data:application/json;base64,${btoa(JSON.stringify(responses))}`,
      size: 1024,
      type: 'application/json',
    };

    const newSubmission: Jawaban = {
      id: existingSub ? existingSub.id : `jwb_${Date.now()}`,
      tugas_id: ulanganId,
      murid_id: muridId,
      file_jawaban: cbtFile,
      catatan_murid: `Dikerjakan via Portal CBT LMS. ${hasEssay ? 'Mengandung soal essay (menunggu koreksi guru).' : 'Koreksi otomatis instan.'}`,
      waktu_upload: new Date().toISOString(),
      status: hasEssay ? 'belum_dinilai' : 'sudah_dinilai',
    };

    if (existingSub) {
      setJawaban(prev => prev.map(j => (j.id === existingSub.id ? newSubmission : j)));
    } else {
      setJawaban(prev => [...prev, newSubmission]);
    }

    // If no essay questions exist, auto-grade feedback record right away
    if (!hasEssay) {
      const pred = nilaiOtomatis >= 90 ? 'Sangat Baik (A)' : nilaiOtomatis >= 80 ? 'Baik (B)' : nilaiOtomatis >= 70 ? 'Cukup (C)' : 'Kurang (D)';
      gradeSubmission(newSubmission.id, nilaiOtomatis, pred, 'Dikoreksi otomatis oleh sistem CBT LMS.');
    } else {
      // Notify teacher that an essay attempt needs grading
      if (targetTask) {
        const notifTeacher: Notifikasi = {
          id: `ntf_${Date.now()}`,
          user_id: targetTask.guru_id,
          jenis: 'jawaban_masuk',
          pesan: `Siswa telah menyelesaikan Ujian CBT "${targetTask.judul}". Memerlukan koreksi soal essay manual.`,
          sudah_dibaca: false,
          tanggal: new Date().toISOString(),
          link_id: targetTask.id,
        };
        setNotifikasi(prev => [notifTeacher, ...prev]);
      }
    }

    return newAttempt;
  };

  const gradeEssayPercobaan = (
    percobaanId: string,
    essayScores: { soalId: string; poin: number }[],
    komentarGuru: string
  ) => {
    const targetAttempt = percobaanUlangan.find(p => p.id === percobaanId);
    if (!targetAttempt) return;

    // Update JawabanSoal points
    setJawabanSoal(prev =>
      prev.map(j => {
        if (j.percobaan_id === percobaanId) {
          const matchScore = essayScores.find(es => es.soalId === j.soal_id);
          if (matchScore !== undefined) {
            return {
              ...j,
              poin_diperoleh: matchScore.poin,
              benar: matchScore.poin > 0,
            };
          }
        }
        return j;
      })
    );

    // Calculate sum of essay points
    const totalEssayPoints = essayScores.reduce((acc, curr) => acc + (curr.poin || 0), 0);
    // Combine auto objective + essay manual
    const autoScore = targetAttempt.nilai_otomatis || 0;
    const finalScore = Math.min(100, Math.round((autoScore * 0.6) + (totalEssayPoints * 0.4)));

    setPercobaanUlangan(prev =>
      prev.map(p =>
        p.id === percobaanId
          ? {
              ...p,
              status_pemeriksaan: 'dinilai_lengkap',
              nilai_manual: totalEssayPoints,
              nilai_total: finalScore,
            }
          : p
      )
    );

    // Sync with NilaiFeedback
    const existingSub = jawaban.find(j => j.tugas_id === targetAttempt.ulangan_id && j.murid_id === targetAttempt.murid_id);
    if (existingSub) {
      const pred = finalScore >= 90 ? 'Sangat Baik (A)' : finalScore >= 80 ? 'Baik (B)' : finalScore >= 70 ? 'Cukup (C)' : 'Kurang (D)';
      gradeSubmission(existingSub.id, finalScore, pred, komentarGuru || 'Telah dinilai lengkap oleh guru.');
    }
  };

  // Reset
  const resetSystemData = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setKelas(INITIAL_KELAS);
    setMapel(INITIAL_MAPEL);
    setGuruMapelKelas(INITIAL_GURU_MAPEL_KELAS);
    setMuridKelas(INITIAL_MURID_KELAS);
    setGuruIzinUpload(INITIAL_GURU_IZIN_UPLOAD);
    setTugas(INITIAL_TUGAS);
    setJawaban(INITIAL_JAWABAN);
    setNilaiFeedback(INITIAL_NILAI_FEEDBACK);
    setNotifikasi(INITIAL_NOTIFIKASI);
    setSoalUlangan(INITIAL_SOAL_ULANGAN);
    setPercobaanUlangan(INITIAL_PERCOBAAN_ULANGAN);
    setJawabanSoal(INITIAL_JAWABAN_SOAL);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        login,
        logout,
        switchUser,
        users,
        kelas,
        mapel,
        guruMapelKelas,
        muridKelas,
        guruIzinUpload,
        tugas,
        jawaban,
        nilaiFeedback,
        notifikasi,

        soalUlangan,
        percobaanUlangan,
        jawabanSoal,
        getSoalForTask,
        saveSoalUlanganForTask,
        addSoalUlangan,
        updateSoalUlangan,
        deleteSoalUlangan,
        submitPercobaanUlangan,
        gradeEssayPercobaan,

        addUser,
        updateUser,
        deleteUser,
        resetUserPassword,
        addClass,
        updateClass,
        deleteClass,
        addSubject,
        updateSubject,
        deleteSubject,
        assignTeacherToClassMapel,
        removeTeacherFromClassMapel,
        assignStudentToClass,
        removeStudentFromClass,
        toggleTeacherUploadPermission,
        canTeacherUploadTask,

        createTask,
        updateTask,
        deleteTask,
        gradeSubmission,

        submitJawaban,

        markNotifAsRead,
        markAllNotifAsRead,

        resetSystemData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
