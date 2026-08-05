import { Tugas, Jawaban, NilaiFeedback } from '../types';

export interface GradeCategoryBreakdown {
  jenis: Tugas['jenis'];
  averageScore: number | null; // null if no graded tasks
  weightPercentage: number;
  contribution: number | null;
  taskCount: number;
}

export interface FinalGradeResult {
  finalScore: number | null;
  predikat: string;
  breakdown: GradeCategoryBreakdown[];
  formulaString: string;
}

export function getPredikatFromScore(score: number): string {
  if (score >= 90) return 'Sangat Baik (A)';
  if (score >= 80) return 'Baik (B)';
  if (score >= 70) return 'Cukup (C)';
  return 'Kurang (D)';
}

export function calculateSemesterGrade(
  studentId: string,
  mapelTasks: Tugas[],
  studentSubmissions: Jawaban[],
  allGrades: NilaiFeedback[]
): FinalGradeResult {
  const categories: Tugas['jenis'][] = ['Tugas Biasa', 'Ulangan Harian', 'UTS', 'UAS'];
  
  const defaultWeights: Record<Tugas['jenis'], number> = {
    'Tugas Biasa': 20,
    'Ulangan Harian': 30,
    'UTS': 20,
    'UAS': 30,
  };

  const breakdown: GradeCategoryBreakdown[] = [];
  let weightedSum = 0;
  let totalWeightUsed = 0;
  const formulaParts: string[] = [];

  categories.forEach(cat => {
    const catTasks = mapelTasks.filter(t => (t.jenis || 'Tugas Biasa') === cat);
    if (catTasks.length === 0) return;

    // Get weight for this category (take average bobot_nilai of tasks in this category or default)
    const avgWeight = catTasks.reduce((acc, t) => acc + (t.bobot_nilai || defaultWeights[cat]), 0) / catTasks.length;

    let catScoreSum = 0;
    let gradedCount = 0;

    catTasks.forEach(task => {
      const sub = studentSubmissions.find(j => j.tugas_id === task.id && j.murid_id === studentId);
      if (sub) {
        const grade = allGrades.find(n => n.jawaban_id === sub.id);
        if (grade) {
          catScoreSum += grade.nilai_angka;
          gradedCount++;
        }
      }
    });

    const avgScore = gradedCount > 0 ? catScoreSum / gradedCount : null;
    const contrib = avgScore !== null ? (avgScore * avgWeight) / 100 : null;

    if (contrib !== null) {
      weightedSum += contrib;
      totalWeightUsed += avgWeight;
      formulaParts.push(`(${cat}: ${avgScore.toFixed(1)} × ${avgWeight}%)`);
    }

    breakdown.push({
      jenis: cat,
      averageScore: avgScore,
      weightPercentage: avgWeight,
      contribution: contrib,
      taskCount: catTasks.length,
    });
  });

  if (totalWeightUsed === 0 || formulaParts.length === 0) {
    return {
      finalScore: null,
      predikat: '-',
      breakdown,
      formulaString: 'Belum ada nilai terinput.',
    };
  }

  // Normalize if not all categories are graded yet
  const finalScore = Number(((weightedSum / totalWeightUsed) * 100).toFixed(1));
  const predikat = getPredikatFromScore(finalScore);
  const formulaString = formulaParts.join(' + ');

  return {
    finalScore,
    predikat,
    breakdown,
    formulaString,
  };
}
