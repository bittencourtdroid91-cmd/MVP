import jsPDF from 'jspdf';
import { AppData } from '../types';
import { lastNDates } from './date';

export const generateWeeklyReport = (data: AppData, userName: string) => {
  const doc = new jsPDF();
  const days = lastNDates(7);

  doc.setFontSize(16);
  doc.text('Relatorio Semanal Vitalis', 14, 18);

  doc.setFontSize(11);
  doc.text(`Paciente: ${userName}`, 14, 28);
  doc.text(`Periodo: ${days[0]} ate ${days[days.length - 1]}`, 14, 35);

  let y = 48;
  days.forEach((date) => {
    const log = data.logs[date];
    const hydration = log?.hydrationLiters ?? 0;
    const score = log?.dailyScore ?? 0;
    const mood = log?.mood ?? 'regular';
    const symptoms = log?.symptoms?.join(', ') || 'nenhum';

    doc.setFontSize(10);
    doc.text(`${date} | score: ${score}/10 | agua: ${hydration}L | humor: ${mood} | sintomas: ${symptoms}`, 14, y);
    y += 8;

    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });

  doc.save(`relatorio-vitalis-${days[days.length - 1]}.pdf`);
};
