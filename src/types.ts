export type Role = 'admin' | 'guru' | 'murid';

export interface FileAttachment {
  nama: string;
  url: string; // Data URL or URL string
  size: number; // in bytes
  type: string; // mime type or extension
}

export interface User {
  id: string;
  nama: string;
  email: string;
  password?: string;
  role: Role;
  foto_profil?: string;
  nip_nisn?: string; // NIP for Guru/Admin, NISN for Murid
  telepon?: string;
}

export interface Kelas {
  id: string;
  nama_kelas: string; // e.g. "7A", "7B", "8A", "8B", "9A", "9B"
  wali_kelas_id?: string; // User ID of Guru assigned as Wali Kelas
}

export interface Mapel {
  id: string;
  nama_mapel: string;
  kode_mapel: string;
}

export interface GuruMapelKelas {
  id: string;
  guru_id: string;
  mapel_id: string;
  kelas_id: string;
}

export interface MuridKelas {
  id: string;
  murid_id: string;
  kelas_id: string;
}

export interface GuruIzinUpload {
  id: string;
  guru_id: string;
  mapel_id: string;
  kelas_id: string;
  diizinkan: boolean;
}

export type JenisTugas = 'Tugas Biasa' | 'Ulangan Harian' | 'UTS' | 'UAS';

export interface Tugas {
  id: string;
  judul: string;
  deskripsi: string;
  guru_id: string;
  mapel_id: string;
  kelas_id: string;
  file_lampiran?: FileAttachment;
  deadline: string; // Datetime string ISO
  tanggal_dibuat: string;
  semester: string; // e.g. "Ganjil 2025/2026"
  jenis: JenisTugas; // 'Tugas Biasa' | 'Ulangan Harian' | 'UTS' | 'UAS'
  bobot_nilai: number; // Percentage contribution (e.g., 20, 30, 20, 30)
  
  // Field tambahan khusus jika jenis = ulangan (CBT LMS):
  durasi_menit?: number | null; // null/0 = tanpa batas waktu
  maks_percobaan?: number; // default 1 (0 = tak terbatas)
  acak_urutan_soal?: boolean; // default true
  acak_urutan_pilihan?: boolean; // default true
  tampilkan_hasil_setelah_selesai?: boolean; // default true
}

export type TipeSoal = 'pilihan_ganda' | 'essay' | 'benar_salah';

export interface PilihanJawaban {
  key: string; // e.g. 'A', 'B', 'C', 'D'
  teks: string;
}

export interface SoalUlangan {
  id: string;
  ulangan_id: string; // relasi ke Tugas
  tipe_soal: TipeSoal;
  teks_soal: string;
  gambar_soal?: string;
  pilihan_jawaban?: PilihanJawaban[]; // khusus pilihan_ganda
  jawaban_benar?: string; // Kunci jawaban (WAJIB diisi guru untuk PG/Benar-Salah; SELALU null/empty untuk essay)
  bobot_poin: number;
  urutan: number;
}

export type StatusPercobaan = 'sedang_dikerjakan' | 'selesai' | 'waktu_habis';
export type StatusPemeriksaan = 'otomatis_selesai' | 'menunggu_pemeriksaan_guru' | 'dinilai_lengkap';

export interface PercobaanUlangan {
  id: string;
  ulangan_id: string; // relasi ke Tugas
  murid_id: string;
  percobaan_ke: number;
  waktu_mulai: string;
  waktu_selesai?: string;
  status: StatusPercobaan;
  status_pemeriksaan: StatusPemeriksaan;
  nilai_otomatis: number; // HANYA dari soal PG & Benar-Salah (dihitung sistem)
  nilai_manual?: number; // HANYA dari soal essay (diisi manual oleh guru)
  nilai_total?: number; // = nilai_otomatis + nilai_manual
}

export interface JawabanSoal {
  id: string;
  percobaan_id: string; // relasi ke PercobaanUlangan
  soal_id: string; // relasi ke SoalUlangan
  jawaban_murid: string; // Key pilihan ('A'/'B'/'C'/'D'), 'Benar'/'Salah', atau teks essay
  benar?: boolean | null; // true/false untuk PG & Benar-Salah; null untuk essay sampai dinilai guru
  poin_diperoleh?: number; // poin yang diperoleh murid
}

export type StatusJawaban = 'belum_dinilai' | 'sudah_dinilai' | 'terlambat';

export interface Jawaban {
  id: string;
  tugas_id: string;
  murid_id: string;
  file_jawaban: FileAttachment;
  catatan_murid?: string;
  waktu_upload: string;
  status: StatusJawaban;
}

export interface NilaiFeedback {
  id: string;
  jawaban_id: string;
  nilai_angka: number; // 0 - 100
  predikat: string; // e.g. "Sangat Baik (A)", "Baik (B)", "Cukup (C)", "Kurang (D)"
  komentar_guru: string;
  tanggal_dinilai: string;
}

export type JenisNotifikasi = 'tugas_baru' | 'deadline' | 'nilai_masuk' | 'jawaban_masuk';

export interface Notifikasi {
  id: string;
  user_id: string;
  jenis: JenisNotifikasi;
  pesan: string;
  sudah_dibaca: boolean;
  tanggal: string;
  link_id?: string; // tugas_id or jawaban_id
}
