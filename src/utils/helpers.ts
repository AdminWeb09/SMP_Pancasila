export function getPredikatFromScore(score: number): string {
  if (score >= 88) return 'Sangat Baik (A)';
  if (score >= 75) return 'Baik (B)';
  if (score >= 60) return 'Cukup (C)';
  return 'Kurang (D)';
}

export function formatDateTime(isoString: string): string {
  if (!isoString) return '-';
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return isoString;
  }
}

export function formatDateOnly(isoString: string): string {
  if (!isoString) return '-';
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return isoString;
  }
}

export function formatFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export const ALLOWED_FILE_EXTENSIONS = [
  '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
  '.png', '.jpg', '.jpeg', '.webp'
];

export function validateFileUpload(file: File): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `Ukuran file melebihi batas maksimum 10 MB (Ukuran file Anda: ${formatFileSize(file.size)}).`
    };
  }

  const fileName = file.name.toLowerCase();
  const hasValidExt = ALLOWED_FILE_EXTENSIONS.some(ext => fileName.endsWith(ext));
  
  if (!hasValidExt) {
    return {
      valid: false,
      error: 'Format file tidak didukung. Harap unggah file PDF, Gambar (PNG/JPG), atau Dokumen (Word/Excel/PowerPoint).'
    };
  }

  return { valid: true };
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

export function isDeadlinePassed(deadlineIso: string): boolean {
  if (!deadlineIso) return false;
  return new Date() > new Date(deadlineIso);
}

export function getTimeRemaining(deadlineIso: string): string {
  if (!deadlineIso) return '-';
  const now = new Date();
  const deadline = new Date(deadlineIso);
  const diffMs = deadline.getTime() - now.getTime();

  if (diffMs <= 0) return 'Selesai (Lewat Deadline)';

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays} hari lagi`;
  } else {
    const remainingHours = diffHours % 24;
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${remainingHours} jam ${diffMins} menit lagi`;
  }
}
