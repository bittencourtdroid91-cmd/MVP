import { ChangeEvent, useState } from 'react';
import { AlertTriangle, Download, FileUp, FileText, CheckSquare, Scale } from 'lucide-react';
import { DailyLog, Mood, Symptom } from '../types';
import { cn } from '../lib/utils';

const moodOptions: Array<{ key: Mood; label: string; emoji: string; color: string }> = [
  { key: 'otima', label: 'Ótima', emoji: '🌟', color: 'border-secondary/40 bg-secondary/10 text-secondary' },
  { key: 'bem', label: 'Bem', emoji: '😊', color: 'border-secondary/20 bg-secondary/5 text-secondary/80' },
  { key: 'regular', label: 'Regular', emoji: '😐', color: 'border-[#ffd700]/30 bg-[#ffd700]/8 text-[#ffd700]' },
  { key: 'cansada', label: 'Cansada', emoji: '😴', color: 'border-tertiary/30 bg-tertiary/8 text-tertiary' },
  { key: 'enjoo', label: 'Enjoo', emoji: '🤢', color: 'border-primary/30 bg-primary/8 text-primary' },
];

const symptomOptions: Array<{ key: Symptom; label: string }> = [
  { key: 'nausea', label: 'Náusea' },
  { key: 'tontura', label: 'Tontura' },
  { key: 'fadiga', label: 'Fadiga' },
  { key: 'dor_cabeca', label: 'Dor de Cabeça' },
];

interface NotesScreenProps {
  log: DailyLog;
  checklistItems: Array<{ id: string; descricao: string; categoria: string }>;
  onMoodChange: (mood: Mood) => void;
  onSymptomsChange: (symptoms: Symptom[]) => void;
  onNoteChange: (note: string) => void;
  onWeightChange: (value: number | undefined) => void;
  onChecklistToggle: (id: string, checked: boolean) => void;
  onExportBackup: () => void;
  onImportBackup: (file: File) => void;
  onGenerateReport: () => void;
}

export default function NotesScreen({
  log, checklistItems, onMoodChange, onSymptomsChange, onNoteChange,
  onWeightChange, onChecklistToggle, onExportBackup, onImportBackup, onGenerateReport,
}: NotesScreenProps) {
  const [weightInput, setWeightInput] = useState(log.weightKg?.toString() ?? '');

  const toggleSymptom = (symptom: Symptom) => {
    const exists = log.symptoms.includes(symptom);
    onSymptomsChange(exists ? log.symptoms.filter((s) => s !== symptom) : [...log.symptoms, symptom]);
  };

  const handleImport = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) { onImportBackup(file); event.target.value = ''; }
  };

  const categorized = checklistItems.reduce<Record<string, typeof checklistItems>>((acc, item) => {
    const cat = item.categoria || 'Geral';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const completedCount = checklistItems.filter((item) => log.checklist[item.id]).length;

  return (
    <div className="space-y-6 pb-4">
      {/* Header */}
      <section className="pt-2 float-up">
        <p className="text-[10px] uppercase tracking-[0.25em] text-secondary font-medium">MONITORAMENTO DIÁRIO</p>
        <h2 className="font-serif text-4xl font-bold mt-1 text-on-surface">Notas & Check</h2>
        <p className="text-sm text-on-surface-variant mt-1">{completedCount}/{checklistItems.length} itens do checklist</p>
      </section>

      {/* Mood selector */}
      <div className="float-up-d1">
        <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold mb-3">Como você está?</p>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {moodOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => onMoodChange(opt.key)}
              className={cn(
                'flex-shrink-0 flex flex-col items-center gap-1 px-4 py-3 rounded-2xl border text-xs font-semibold transition-all duration-300',
                log.mood === opt.key ? opt.color : 'border-outline-variant text-on-surface-variant hover:bg-surface-container-high'
              )}
            >
              <span className="text-xl">{opt.emoji}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Symptoms */}
      <div className="float-up-d2">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={13} className="text-on-surface-variant" />
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold">Sintomas Wegovy</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {symptomOptions.map((opt) => {
            const active = log.symptoms.includes(opt.key);
            return (
              <button
                key={opt.key}
                onClick={() => toggleSymptom(opt.key)}
                className={cn(
                  'px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-300',
                  active
                    ? 'bg-primary/15 border-primary/40 text-primary glow-primary'
                    : 'border-outline-variant text-on-surface-variant hover:bg-surface-container-high'
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Peso */}
      <div className="glass-card rounded-2xl p-4 ghost-border float-up-d2">
        <div className="flex items-center gap-2 mb-3">
          <Scale size={13} className="text-on-surface-variant" />
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold">Peso do Dia (opcional)</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="number"
            step="0.1"
            placeholder="kg"
            value={weightInput}
            onChange={(e) => {
              setWeightInput(e.target.value);
              const parsed = parseFloat(e.target.value);
              onWeightChange(isNaN(parsed) ? undefined : parsed);
            }}
            className="flex-1 bg-surface-container-high border border-outline-variant rounded-xl px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-secondary/50 transition-colors"
          />
          <span className="text-on-surface-variant text-sm">kg</span>
        </div>
      </div>

      {/* Checklist */}
      <div className="float-up-d3">
        <div className="flex items-center gap-2 mb-3">
          <CheckSquare size={13} className="text-on-surface-variant" />
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold">Checklist Diário</p>
        </div>
        <div className="space-y-2">
          {Object.entries(categorized).map(([cat, items]) => (
            <div key={cat} className="glass-card rounded-2xl ghost-border overflow-hidden">
              <div className="px-4 py-2 bg-surface-container-high">
                <p className="text-[9px] uppercase tracking-widest text-on-surface-variant font-semibold">{cat}</p>
              </div>
              <div className="divide-y divide-outline-variant/30">
                {items.map((item) => {
                  const checked = log.checklist[item.id] ?? false;
                  return (
                    <label
                      key={item.id}
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-surface-container-high/50 transition-colors"
                    >
                      <div className={cn(
                        'w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300',
                        checked ? 'bg-secondary border-secondary' : 'border-outline-variant'
                      )}>
                        {checked && <span className="text-on-secondary text-[10px] font-black">✓</span>}
                      </div>
                      <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChecklistToggle(item.id, e.target.checked)} />
                      <span className={cn('text-sm transition-all', checked ? 'line-through text-on-surface-variant/50' : 'text-on-surface')}>
                        {item.descricao}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notes textarea */}
      <div className="float-up-d3">
        <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold mb-3">Anotação Livre</p>
        <textarea
          value={log.note}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="Como foi o dia? Sensações, observações..."
          rows={4}
          className="w-full bg-surface-container ghost-border rounded-2xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-secondary/40 border border-outline-variant transition-colors resize-none"
        />
      </div>

      {/* Actions */}
      <div className="grid grid-cols-3 gap-2 float-up-d4">
        <button
          onClick={onGenerateReport}
          className="flex flex-col items-center gap-2 p-3 glass-card rounded-2xl ghost-border hover:bg-surface-container-high transition-colors"
        >
          <FileText size={16} className="text-primary" />
          <span className="text-[9px] uppercase tracking-widest text-on-surface-variant text-center leading-tight">Gerar Relatório</span>
        </button>
        <button
          onClick={onExportBackup}
          className="flex flex-col items-center gap-2 p-3 glass-card rounded-2xl ghost-border hover:bg-surface-container-high transition-colors"
        >
          <Download size={16} className="text-secondary" />
          <span className="text-[9px] uppercase tracking-widest text-on-surface-variant text-center leading-tight">Exportar Backup</span>
        </button>
        <label className="flex flex-col items-center gap-2 p-3 glass-card rounded-2xl ghost-border hover:bg-surface-container-high transition-colors cursor-pointer">
          <FileUp size={16} className="text-tertiary" />
          <span className="text-[9px] uppercase tracking-widest text-on-surface-variant text-center leading-tight">Importar Backup</span>
          <input type="file" accept=".json" className="hidden" onChange={handleImport} />
        </label>
      </div>
    </div>
  );
}
