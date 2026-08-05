import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { formatDateOnly } from './helpers';

export interface RekapNilaiRow {
  nisn: string;
  namaMurid: string;
  kelas: string;
  mapel: string;
  judulTugas: string;
  waktuKumpul: string;
  status: string;
  nilai: number | string;
  predikat: string;
  catatanGuru: string;
}

export function exportToExcel(filename: string, sheetName: string, data: Record<string, unknown>[]) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

export function exportHomeroomReportCardPDF(
  namaKelas: string,
  namaWaliKelas: string,
  semester: string,
  dataMurid: {
    nama: string;
    nisn: string;
    mapelScores: { mapel: string; nilai: number | string; predikat: string }[];
    rataRata: number;
    jumlahSeringTelat: number;
  }[]
) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Header SMP PANCASILA
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('SMP PANCASILA KRIAN SIDOARJO', 105, 15, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('NPSN: 120412 | Akreditasi A | Yayasan Taman Pendidikan Al-Hidayah Krian', 105, 21, { align: 'center' });
  doc.text('Jl. Raya Krian No. 45, Kec. Krian, Kab. Sidoarjo, Jawa Timur', 105, 26, { align: 'center' });
  
  doc.setLineWidth(0.5);
  doc.line(14, 29, 196, 29);

  // Report Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(`LAPORAN REKAPITULASI NILAI KELAS ${namaKelas}`, 105, 37, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Wali Kelas: ${namaWaliKelas}`, 14, 45);
  doc.text(`Semester: ${semester}`, 14, 50);
  doc.text(`Tanggal Cetak: ${formatDateOnly(new Date().toISOString())}`, 14, 55);

  let y = 62;

  // Table Header
  doc.setFillColor(16, 185, 129); // Emerald green
  doc.rect(14, y, 182, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);

  doc.text('No', 16, y + 5.5);
  doc.text('NISN', 25, y + 5.5);
  doc.text('Nama Murid', 55, y + 5.5);
  doc.text('Rata-Rata', 125, y + 5.5);
  doc.text('Keterlambatan', 155, y + 5.5);

  y += 8;
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');

  dataMurid.forEach((student, index) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    // Row zebra background
    if (index % 2 === 1) {
      doc.setFillColor(243, 244, 246);
      doc.rect(14, y, 182, 7, 'F');
    }

    doc.text(`${index + 1}`, 16, y + 5);
    doc.text(student.nisn || '-', 25, y + 5);
    doc.text(student.nama, 55, y + 5);
    doc.text(`${student.rataRata > 0 ? student.rataRata.toFixed(1) : '-'}`, 125, y + 5);
    doc.text(`${student.jumlahSeringTelat} x`, 155, y + 5);

    y += 7;
  });

  // Footer signature
  y += 15;
  if (y > 250) {
    doc.addPage();
    y = 30;
  }

  doc.text('Mengetahui,', 140, y);
  doc.text('Wali Kelas', 140, y + 5);
  doc.text(`( ${namaWaliKelas} )`, 140, y + 25);

  doc.save(`Rekap_Nilai_Kelas_${namaKelas}_SMP_PANCASILA.pdf`);
}
