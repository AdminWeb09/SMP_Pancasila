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
  SoalUlangan,
  PercobaanUlangan,
  JawabanSoal
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_admin',
    nama: 'Bpk. Wahyu Hidayat, S.Kom.',
    email: 'admin@smppancasila.sch.id',
    password: 'password123',
    role: 'admin',
    nip_nisn: '198503122010011005',
    telepon: '081234567890',
    foto_profil: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr_guru_bambang',
    nama: 'Bpk. Bambang Sugianto, S.Pd.',
    email: 'bambang@smppancasila.sch.id',
    password: 'password123',
    role: 'guru',
    nip_nisn: '197804152005011002',
    telepon: '081333444555',
    foto_profil: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr_guru_siti',
    nama: 'Ibu Siti Rahmawati, M.Pd.',
    email: 'siti@smppancasila.sch.id',
    password: 'password123',
    role: 'guru',
    nip_nisn: '198209202008012006',
    telepon: '081333444666',
    foto_profil: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr_guru_ahmad',
    nama: 'Bpk. Ahmad Dahlan, S.Si.',
    email: 'ahmad@smppancasila.sch.id',
    password: 'password123',
    role: 'guru',
    nip_nisn: '198001012006041009',
    telepon: '081333444777',
    foto_profil: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr_guru_dewi',
    nama: 'Ibu Dewi Sartika, S.Pd.',
    email: 'dewi@smppancasila.sch.id',
    password: 'password123',
    role: 'guru',
    nip_nisn: '198811102012012004',
    telepon: '081333444888',
    foto_profil: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr_murid_rizky',
    nama: 'Ahmad Rizky Ramadhan',
    email: 'rizky@siswa.smppancasila.sch.id',
    password: 'password123',
    role: 'murid',
    nip_nisn: '00987654311',
    telepon: '085711223344',
    foto_profil: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr_murid_budi',
    nama: 'Budi Santoso',
    email: 'budi@siswa.smppancasila.sch.id',
    password: 'password123',
    role: 'murid',
    nip_nisn: '00987654312',
    telepon: '085711223355',
    foto_profil: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr_murid_citra',
    nama: 'Citra Dewi Anggraini',
    email: 'citra@siswa.smppancasila.sch.id',
    password: 'password123',
    role: 'murid',
    nip_nisn: '00987654313',
    telepon: '085711223366',
    foto_profil: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr_murid_dinda',
    nama: 'Dinda Ayu Lestari',
    email: 'dinda@siswa.smppancasila.sch.id',
    password: 'password123',
    role: 'murid',
    nip_nisn: '00987654314',
    telepon: '085711223377',
    foto_profil: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr_murid_eko',
    nama: 'Eko Prasetyo',
    email: 'eko@siswa.smppancasila.sch.id',
    password: 'password123',
    role: 'murid',
    nip_nisn: '00987654315',
    telepon: '085711223388',
    foto_profil: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
  },
];

export const INITIAL_KELAS: Kelas[] = [
  { id: 'kls_7a', nama_kelas: '7A', wali_kelas_id: 'usr_guru_bambang' },
  { id: 'kls_7b', nama_kelas: '7B', wali_kelas_id: 'usr_guru_siti' },
  { id: 'kls_8a', nama_kelas: '8A', wali_kelas_id: 'usr_guru_ahmad' },
  { id: 'kls_8b', nama_kelas: '8B' },
  { id: 'kls_9a', nama_kelas: '9A' },
  { id: 'kls_9b', nama_kelas: '9B' },
];

export const INITIAL_MAPEL: Mapel[] = [
  { id: 'mpl_mat', nama_mapel: 'Matematika', kode_mapel: 'MAT' },
  { id: 'mpl_bin', nama_mapel: 'Bahasa Indonesia', kode_mapel: 'BIN' },
  { id: 'mpl_ipa', nama_mapel: 'IPA Terpadu', kode_mapel: 'IPA' },
  { id: 'mpl_ips', nama_mapel: 'IPS', kode_mapel: 'IPS' },
  { id: 'mpl_ing', nama_mapel: 'Bahasa Inggris', kode_mapel: 'ING' },
  { id: 'mpl_pai', nama_mapel: 'Pendidikan Agama Islam', kode_mapel: 'PAI' },
  { id: 'mpl_inf', nama_mapel: 'Informatika', kode_mapel: 'INF' },
  { id: 'mpl_ppk', nama_mapel: 'PPKn', kode_mapel: 'PPK' },
];

export const INITIAL_GURU_MAPEL_KELAS: GuruMapelKelas[] = [
  // Bpk. Bambang -> Matematika (7A, 7B)
  { id: 'gmk_1', guru_id: 'usr_guru_bambang', mapel_id: 'mpl_mat', kelas_id: 'kls_7a' },
  { id: 'gmk_2', guru_id: 'usr_guru_bambang', mapel_id: 'mpl_mat', kelas_id: 'kls_7b' },

  // Ibu Siti -> Bahasa Indonesia (7A, 7B)
  { id: 'gmk_3', guru_id: 'usr_guru_siti', mapel_id: 'mpl_bin', kelas_id: 'kls_7a' },
  { id: 'gmk_4', guru_id: 'usr_guru_siti', mapel_id: 'mpl_bin', kelas_id: 'kls_7b' },

  // Bpk. Ahmad -> IPA Terpadu (7A, 8A)
  { id: 'gmk_5', guru_id: 'usr_guru_ahmad', mapel_id: 'mpl_ipa', kelas_id: 'kls_7a' },
  { id: 'gmk_6', guru_id: 'usr_guru_ahmad', mapel_id: 'mpl_ipa', kelas_id: 'kls_8a' },

  // Ibu Dewi -> Bahasa Inggris (7A, 8A)
  { id: 'gmk_7', guru_id: 'usr_guru_dewi', mapel_id: 'mpl_ing', kelas_id: 'kls_7a' },
  { id: 'gmk_8', guru_id: 'usr_guru_dewi', mapel_id: 'mpl_ing', kelas_id: 'kls_8a' },
];

export const INITIAL_MURID_KELAS: MuridKelas[] = [
  { id: 'mk_1', murid_id: 'usr_murid_rizky', kelas_id: 'kls_7a' },
  { id: 'mk_2', murid_id: 'usr_murid_budi', kelas_id: 'kls_7a' },
  { id: 'mk_3', murid_id: 'usr_murid_citra', kelas_id: 'kls_7a' },
  { id: 'mk_4', murid_id: 'usr_murid_dinda', kelas_id: 'kls_7a' },
  { id: 'mk_5', murid_id: 'usr_murid_eko', kelas_id: 'kls_7b' },
];

export const INITIAL_GURU_IZIN_UPLOAD: GuruIzinUpload[] = [
  { id: 'gi_1', guru_id: 'usr_guru_bambang', mapel_id: 'mpl_mat', kelas_id: 'kls_7a', diizinkan: true },
  { id: 'gi_2', guru_id: 'usr_guru_bambang', mapel_id: 'mpl_mat', kelas_id: 'kls_7b', diizinkan: true },
  { id: 'gi_3', guru_id: 'usr_guru_siti', mapel_id: 'mpl_bin', kelas_id: 'kls_7a', diizinkan: true },
  { id: 'gi_4', guru_id: 'usr_guru_siti', mapel_id: 'mpl_bin', kelas_id: 'kls_7b', diizinkan: true },
  { id: 'gi_5', guru_id: 'usr_guru_ahmad', mapel_id: 'mpl_ipa', kelas_id: 'kls_7a', diizinkan: true },
  { id: 'gi_6', guru_id: 'usr_guru_ahmad', mapel_id: 'mpl_ipa', kelas_id: 'kls_8a', diizinkan: true },
  { id: 'gi_7', guru_id: 'usr_guru_dewi', mapel_id: 'mpl_ing', kelas_id: 'kls_7a', diizinkan: true },
  // Explicitly set false for Dewi in 8A to test admin restriction!
  { id: 'gi_8', guru_id: 'usr_guru_dewi', mapel_id: 'mpl_ing', kelas_id: 'kls_8a', diizinkan: false },
];

const now = new Date();
const inThreeDays = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();
const inFiveDays = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString();
const pastTwoDays = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString();
const pastFiveDays = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString();

export const INITIAL_TUGAS: Tugas[] = [
  {
    id: 'tgs_mat_7a_1',
    judul: 'Tugas 1: Persamaan Linier Satu Variabel',
    deskripsi: 'Selesaikan soal latihan bab 3 halaman 45-47 nomor 1 sampai 10. Kerjakan di buku tugas dan unggah foto/scan jawaban dalam format PDF atau Gambar yang jelas.',
    guru_id: 'usr_guru_bambang',
    mapel_id: 'mpl_mat',
    kelas_id: 'kls_7a',
    deadline: inThreeDays,
    tanggal_dibuat: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    semester: 'Ganjil 2025/2026',
    jenis: 'Tugas Biasa',
    bobot_nilai: 20,
    file_lampiran: {
      nama: 'Soal_Persamaan_Linier_Latihan3.pdf',
      url: 'data:application/pdf;base64,JVBERi0xLjQKJ...',
      size: 1250000,
      type: 'application/pdf',
    },
  },
  {
    id: 'tgs_bin_7a_1',
    judul: 'Tugas Teks Deskripsi Lingkungan Sekolah',
    deskripsi: 'Buatlah karangan teks deskripsi minimal 300 kata tentang fasilitas atau area favorit kalian di SMP PANCASILA Krian. Gunakan ejaan bahasa Indonesia yang baku.',
    guru_id: 'usr_guru_siti',
    mapel_id: 'mpl_bin',
    kelas_id: 'kls_7a',
    deadline: inFiveDays,
    tanggal_dibuat: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    semester: 'Ganjil 2025/2026',
    jenis: 'Tugas Biasa',
    bobot_nilai: 20,
  },
  {
    id: 'tgs_ipa_7a_1',
    judul: 'Laporan Praktikum Pengukuran & Besaran',
    deskripsi: 'Tuliskan laporan hasil praktikum pengukuran panjang, massa, dan waktu yang telah kita lakukan minggu lalu di laboratorium IPA.',
    guru_id: 'usr_guru_ahmad',
    mapel_id: 'mpl_ipa',
    kelas_id: 'kls_7a',
    deadline: pastTwoDays,
    tanggal_dibuat: pastFiveDays,
    semester: 'Ganjil 2025/2026',
    jenis: 'Tugas Biasa',
    bobot_nilai: 20,
    file_lampiran: {
      nama: 'Panduan_Format_Laporan_IPA.docx',
      url: 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,UEsDBBQ...',
      size: 850000,
      type: 'application/docx',
    },
  },
  {
    id: 'tgs_ipa_7a_2',
    judul: 'Ulangan Harian 1: Klasifikasi Makhluk Hidup',
    deskripsi: 'Ulangan harian bab 2 tentang taksonomi dan kunci dikotom. Kerjakan soal essay pada lembar jawaban dan unggah file PDF/Foto jawaban Anda.',
    guru_id: 'usr_guru_ahmad',
    mapel_id: 'mpl_ipa',
    kelas_id: 'kls_7a',
    deadline: pastTwoDays,
    tanggal_dibuat: pastFiveDays,
    semester: 'Ganjil 2025/2026',
    jenis: 'Ulangan Harian',
    bobot_nilai: 30,
  },
  {
    id: 'tgs_ipa_7a_uts',
    judul: 'UTS IPA Terpadu Semester Ganjil',
    deskripsi: 'Ujian Tengah Semester (UTS) mata pelajaran IPA Terpadu Kelas 7A.',
    guru_id: 'usr_guru_ahmad',
    mapel_id: 'mpl_ipa',
    kelas_id: 'kls_7a',
    deadline: pastTwoDays,
    tanggal_dibuat: pastFiveDays,
    semester: 'Ganjil 2025/2026',
    jenis: 'UTS',
    bobot_nilai: 20,
  },
];

export const INITIAL_JAWABAN: Jawaban[] = [
  // Jawaban Ahmad Rizky untuk Tugas IPA (Past deadline, submitted on time before deadline)
  {
    id: 'jwb_rizky_ipa',
    tugas_id: 'tgs_ipa_7a_1',
    murid_id: 'usr_murid_rizky',
    file_jawaban: {
      nama: 'Jawaban_IPA_Ahmad_Rizky.pdf',
      url: 'data:application/pdf;base64,JVBERi0xLjQKJ...',
      size: 2100000,
      type: 'application/pdf',
    },
    catatan_murid: 'Pak, ini laporan praktikum saya. Mohon bimbingannya jika ada kesalahan.',
    waktu_upload: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'sudah_dinilai',
  },
  {
    id: 'jwb_rizky_ipa_uh',
    tugas_id: 'tgs_ipa_7a_2',
    murid_id: 'usr_murid_rizky',
    file_jawaban: {
      nama: 'Jawaban_UH1_IPA_Rizky.pdf',
      url: 'data:application/pdf;base64,JVBERi0xLjQKJ...',
      size: 1800000,
      type: 'application/pdf',
    },
    catatan_murid: 'Lembar jawaban Ulangan Harian 1',
    waktu_upload: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'sudah_dinilai',
  },
  {
    id: 'jwb_rizky_ipa_uts',
    tugas_id: 'tgs_ipa_7a_uts',
    murid_id: 'usr_murid_rizky',
    file_jawaban: {
      nama: 'Jawaban_UTS_IPA_Rizky.pdf',
      url: 'data:application/pdf;base64,JVBERi0xLjQKJ...',
      size: 2500000,
      type: 'application/pdf',
    },
    catatan_murid: 'Lembar jawaban UTS IPA Terpadu',
    waktu_upload: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'sudah_dinilai',
  },
  // Jawaban Citra Dewi untuk Tugas IPA
  {
    id: 'jwb_citra_ipa',
    tugas_id: 'tgs_ipa_7a_1',
    murid_id: 'usr_murid_citra',
    file_jawaban: {
      nama: 'Laporan_IPA_Citra_Dewi.pdf',
      url: 'data:application/pdf;base64,JVBERi0xLjQKJ...',
      size: 1950000,
      type: 'application/pdf',
    },
    catatan_murid: 'Sudah diunggah lengkap dengan tabel data dan grafik.',
    waktu_upload: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'sudah_dinilai',
  },
  // Jawaban Budi Santoso untuk Tugas Matematika (Active task, submitted early)
  {
    id: 'jwb_budi_mat',
    tugas_id: 'tgs_mat_7a_1',
    murid_id: 'usr_murid_budi',
    file_jawaban: {
      nama: 'Jawaban_Matematika_Budi.jpg',
      url: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...',
      size: 3400000,
      type: 'image/jpeg',
    },
    catatan_murid: 'Sudah selesai pak 10 nomor.',
    waktu_upload: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
    status: 'belum_dinilai',
  },
];

export const INITIAL_NILAI_FEEDBACK: NilaiFeedback[] = [
  {
    id: 'nl_rizky_ipa',
    jawaban_id: 'jwb_rizky_ipa',
    nilai_angka: 92,
    predikat: 'Sangat Baik (A)',
    komentar_guru: 'Sangat bagus! Analisis data pengukuran sangat rinci dan format tabel rapi.',
    tanggal_dinilai: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'nl_rizky_ipa_uh',
    jawaban_id: 'jwb_rizky_ipa_uh',
    nilai_angka: 88,
    predikat: 'Sangat Baik (A)',
    komentar_guru: 'Jawaban ulangan harian sangat lengkap dan tepat.',
    tanggal_dinilai: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'nl_rizky_ipa_uts',
    jawaban_id: 'jwb_rizky_ipa_uts',
    nilai_angka: 90,
    predikat: 'Sangat Baik (A)',
    komentar_guru: 'Hasil UTS luar biasa!',
    tanggal_dinilai: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'nl_citra_ipa',
    jawaban_id: 'jwb_citra_ipa',
    nilai_angka: 88,
    predikat: 'Sangat Baik (A)',
    komentar_guru: 'Hasil praktikum tepat dan pembuatan grafik baik.',
    tanggal_dinilai: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const INITIAL_NOTIFIKASI: Notifikasi[] = [
  {
    id: 'ntf_1',
    user_id: 'usr_murid_rizky',
    jenis: 'nilai_masuk',
    pesan: 'Nilai dan feedback untuk "Laporan Praktikum Pengukuran & Besaran" telah diberikan oleh Bpk. Ahmad Dahlan, S.Si. (Nilai: 92)',
    sudah_dibaca: false,
    tanggal: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    link_id: 'tgs_ipa_7a_1',
  },
  {
    id: 'ntf_2',
    user_id: 'usr_murid_rizky',
    jenis: 'tugas_baru',
    pesan: 'Tugas Baru: "Tugas 1: Persamaan Linier Satu Variabel" telah diunggah oleh Bpk. Bambang Sugianto, S.Pd.',
    sudah_dibaca: false,
    tanggal: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    link_id: 'tgs_mat_7a_1',
  },
  {
    id: 'ntf_3',
    user_id: 'usr_guru_bambang',
    jenis: 'jawaban_masuk',
    pesan: 'Budi Santoso telah mengunggah jawaban untuk "Tugas 1: Persamaan Linier Satu Variabel"',
    sudah_dibaca: false,
    tanggal: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
    link_id: 'tgs_mat_7a_1',
  },
];

export const INITIAL_SOAL_ULANGAN: SoalUlangan[] = [
  {
    id: 'soal_uh_1',
    ulangan_id: 'tgs_ipa_7a_2',
    tipe_soal: 'pilihan_ganda',
    teks_soal: 'Berikut ini yang termasuk ke dalam kelompok tumbuhan berbiji terbuka (Gymnospermae) adalah...',
    pilihan_jawaban: [
      { key: 'A', teks: 'Padi dan Jagung' },
      { key: 'B', teks: 'Pinus dan Pakis Haji' },
      { key: 'C', teks: 'Mangga dan Rambutan' },
      { key: 'D', teks: 'Pisang dan Kelapa' },
    ],
    jawaban_benar: 'B', // Kunci Jawaban Wajib untuk PG
    bobot_poin: 30,
    urutan: 1,
  },
  {
    id: 'soal_uh_2',
    ulangan_id: 'tgs_ipa_7a_2',
    tipe_soal: 'benar_salah',
    teks_soal: 'Jamur (Fungi) dimasukkan ke dalam kerajaan tumbuhan (Plantae) karena memiliki klorofil.',
    jawaban_benar: 'Salah', // Kunci Jawaban Wajib untuk Benar-Salah
    bobot_poin: 30,
    urutan: 2,
  },
  {
    id: 'soal_uh_3',
    ulangan_id: 'tgs_ipa_7a_2',
    tipe_soal: 'essay',
    teks_soal: 'Jelaskan tahapan pembuatan kunci determinasi / dikotom sederhana beserta contoh pengelompokan vertebrata!',
    // jawaban_benar KOSONG untuk essay karena dinilai manual oleh guru
    bobot_poin: 40,
    urutan: 3,
  },
];

export const INITIAL_PERCOBAAN_ULANGAN: PercobaanUlangan[] = [];
export const INITIAL_JAWABAN_SOAL: JawabanSoal[] = [];
