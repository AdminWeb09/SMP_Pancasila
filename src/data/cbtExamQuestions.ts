import { SoalUlangan } from '../types';

export const SAMPLE_SOAL_ULANGAN: Record<string, Omit<SoalUlangan, 'id' | 'ulangan_id'>[]> = {
  mpl_ipa: [
    {
      tipe_soal: 'pilihan_ganda',
      teks_soal: 'Berikut ini yang termasuk ke dalam ciri-ciri umum makhluk hidup adalah...',
      pilihan_jawaban: [
        { key: 'A', teks: 'Memiliki warna yang menyolok' },
        { key: 'B', teks: 'Bernapas, tumbuh, berkembang biak, dan peka terhadap rangsang' },
        { key: 'C', teks: 'Selalu tinggal di dalam air laut' },
        { key: 'D', teks: 'Tidak membutuhkan sumber energi dari luar' },
      ],
      jawaban_benar: 'B', // Kunci Jawaban Wajib untuk PG
      bobot_poin: 25,
      urutan: 1,
    },
    {
      tipe_soal: 'benar_salah',
      teks_soal: 'Satuan Internasional (SI) untuk mengukur besaran suhu benda adalah Celcius (°C).',
      jawaban_benar: 'Salah', // Kunci Jawaban Wajib untuk Benar-Salah (seharusnya Kelvin)
      bobot_poin: 25,
      urutan: 2,
    },
    {
      tipe_soal: 'pilihan_ganda',
      teks_soal: 'Organisme heterotrof yang memperoleh nutrisi dengan cara menguraikan sisa makhluk hidup yang telah mati dinamakan...',
      pilihan_jawaban: [
        { key: 'A', teks: 'Produsen (Autotrof)' },
        { key: 'B', teks: 'Dekomposer / Pengurai' },
        { key: 'C', teks: 'Konsumen Tingkat I' },
        { key: 'D', teks: 'Herbivora' },
      ],
      jawaban_benar: 'B',
      bobot_poin: 25,
      urutan: 3,
    },
    {
      tipe_soal: 'essay',
      teks_soal: 'Jelaskan perbedaan mendasar antara sel tumbuhan dan sel hewan beserta fungsi organel plastida (kloroplas)!',
      // jawaban_benar TIDAK ADA untuk essay karena dinilai manual oleh guru
      bobot_poin: 25,
      urutan: 4,
    },
  ],
  mpl_mat: [
    {
      tipe_soal: 'pilihan_ganda',
      teks_soal: 'Penyelesaian dari persamaan linier 3x + 5 = 20 adalah...',
      pilihan_jawaban: [
        { key: 'A', teks: 'x = 3' },
        { key: 'B', teks: 'x = 5' },
        { key: 'C', teks: 'x = 6' },
        { key: 'D', teks: 'x = 15' },
      ],
      jawaban_benar: 'B',
      bobot_poin: 30,
      urutan: 1,
    },
    {
      tipe_soal: 'benar_salah',
      teks_soal: 'Hasil perkalian bilangan negatif dengan bilangan negatif selalu menghasilkan bilangan negatif.',
      jawaban_benar: 'Salah', // Seharusnya positif
      bobot_poin: 20,
      urutan: 2,
    },
    {
      tipe_soal: 'pilihan_ganda',
      teks_soal: 'Sebuah denah rumah dibuat dengan skala 1 : 200. Jika panjang ruang tamu pada denah adalah 4 cm, maka panjang sebenarnya adalah...',
      pilihan_jawaban: [
        { key: 'A', teks: '6 meter' },
        { key: 'B', teks: '8 meter' },
        { key: 'C', teks: '10 meter' },
        { key: 'D', teks: '80 meter' },
      ],
      jawaban_benar: 'B',
      bobot_poin: 25,
      urutan: 3,
    },
    {
      tipe_soal: 'essay',
      teks_soal: 'Ibu membeli 3 kg beras dan 2 kg gula seharga Rp 75.000,-. Tuliskan bentuk persamaan matematikanya dan tentukan harga 1 kg beras jika harga 1 kg gula adalah Rp 18.000,-!',
      bobot_poin: 25,
      urutan: 4,
    },
  ],
  default: [
    {
      tipe_soal: 'pilihan_ganda',
      teks_soal: 'Gagasan utama yang menjadi dasar atau tumpuan pengembangan suatu paragraf disebut...',
      pilihan_jawaban: [
        { key: 'A', teks: 'Ide Pokok / Gagasan Utama' },
        { key: 'B', teks: 'Kalimat Penjelas' },
        { key: 'C', teks: 'Kesimpulan' },
        { key: 'D', teks: 'Judul Karangan' },
      ],
      jawaban_benar: 'A',
      bobot_poin: 35,
      urutan: 1,
    },
    {
      tipe_soal: 'benar_salah',
      teks_soal: 'Menjaga kerukunan antar suku di sekolah adalah contoh pengamalan Sila ke-3 Pancasila.',
      jawaban_benar: 'Benar',
      bobot_poin: 35,
      urutan: 2,
    },
    {
      tipe_soal: 'essay',
      teks_soal: 'Tuliskan rangkuman singkat jawaban Anda terkait materi pelajaran yang diujikan dalam Ulangan/Ujian ini beserta analisis penyelesaiannya!',
      bobot_poin: 30,
      urutan: 3,
    },
  ],
};

export function getExamQuestionsForTask(taskUlanganId: string, mapelId: string): SoalUlangan[] {
  const samples = SAMPLE_SOAL_ULANGAN[mapelId] || SAMPLE_SOAL_ULANGAN['default'];
  return samples.map((s, idx) => ({
    ...s,
    id: `soal_${taskUlanganId}_${idx + 1}`,
    ulangan_id: taskUlanganId,
  }));
}

