import { Activity, AlertTriangle, CheckCircle2, Dumbbell, Timer, Zap } from 'lucide-react';
import { KneeStatus } from '../types';
import { cn } from '../lib/utils';

interface WorkoutScreenProps {
  kneeStatus: KneeStatus;
  onKneeStatusChange: (status: KneeStatus) => void;
}

const kneeOptions: Array<{ key: KneeStatus; label: string; desc: string; color: string; glow: string }> = [
  { key: 'verde', label: 'Ótimo', desc: 'Sem dor ou desconforto', color: 'text-secondary border-secondary/30 bg-secondary/10', glow: 'glow-secondary-strong' },
  { key: 'amarelo', label: 'Moderado', desc: 'Leve sensibilidade', color: 'text-[#ffd700] border-[#ffd700]/30 bg-[#ffd700]/10', glow: '' },
  { key: 'vermelho', label: 'Descanso', desc: 'Dor presente — evitar impacto', color: 'text-primary border-primary/30 bg-primary/10', glow: 'glow-primary-strong' },
];

const workoutsByStatus: Record<KneeStatus, Array<{ name: string; sets: string; rest: string; icon: typeof Activity }>> = {
  verde: [
    { name: 'Caminhada leve 20min', sets: '1x', rest: '—', icon: Activity },
    { name: 'Agachamento assistido', sets: '3×12', rest: '60s', icon: Dumbbell },
    { name: 'Elevação de quadril', sets: '3×15', rest: '45s', icon: Dumbbell },
    { name: 'Alongamento global', sets: '10min', rest: '—', icon: Timer },
  ],
  amarelo: [
    { name: 'Caminhada plana 15min', sets: '1x', rest: '—', icon: Activity },
    { name: 'Cadeira extensora leve', sets: '2×12', rest: '60s', icon: Dumbbell },
    { name: 'Elevação de perna', sets: '3×12', rest: '45s', icon: Dumbbell },
    { name: 'Alongamento joelho', sets: '8min', rest: '—', icon: Timer },
  ],
  vermelho: [
    { name: 'Descanso ativo', sets: '—', rest: '—', icon: AlertTriangle },
    { name: 'Exercícios sentada', sets: '2×10', rest: '90s', icon: Dumbbell },
    { name: 'Gelo no joelho 15min', sets: '2x', rest: '—', icon: Timer },
    { name: 'Respiração diafragmática', sets: '10min', rest: '—', icon: Activity },
  ],
};

export default function WorkoutScreen({ kneeStatus, onKneeStatusChange }: WorkoutScreenProps) {
  const exercises = workoutsByStatus[kneeStatus];

  return (
    <div className="space-y-6 pb-4">
      {/* Header */}
      <section className="pt-2 float-up">
        <p className="text-[10px] uppercase tracking-[0.25em] text-secondary font-medium">PROTOCOLO DE EXERCÍCIOS</p>
        <h2 className="font-serif text-4xl font-bold mt-1 text-on-surface">Treino</h2>
        <p className="text-sm text-on-surface-variant mt-1">Adaptado ao status articular do dia</p>
      </section>

      {/* Knee status selector */}
      <div className="float-up-d1">
        <div className="flex items-center gap-2 mb-3">
          <Zap size={13} className="text-on-surface-variant" />
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold">Status do Joelho</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {kneeOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => onKneeStatusChange(opt.key)}
              className={cn(
                'rounded-2xl p-3 border text-center transition-all duration-300',
                kneeStatus === opt.key ? cn(opt.color, opt.glow) : 'border-outline-variant text-on-surface-variant bg-surface-container/30 hover:bg-surface-container-high'
              )}
            >
              <p className={cn('text-sm font-bold', kneeStatus === opt.key ? '' : 'text-on-surface-variant')}>{opt.label}</p>
              <p className="text-[9px] mt-0.5 leading-tight opacity-70">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Status info */}
      {kneeStatus === 'vermelho' && (
        <div className="glass-card rounded-2xl p-4 border border-primary/20 ghost-border float-up-d1">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={14} className="text-primary" />
            <p className="text-xs font-semibold text-primary">Protocolo de Repouso Ativo</p>
          </div>
          <p className="text-xs text-on-surface-variant">Evite impacto e exercícios de carga no joelho hoje. Priorize recuperação.</p>
        </div>
      )}

      {/* Exercise list */}
      <div className="space-y-3 float-up-d2">
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle2 size={13} className="text-on-surface-variant" />
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold">Exercícios de Hoje</p>
        </div>
        {exercises.map((ex, i) => (
          <div
            key={i}
            className="glass-card rounded-2xl p-4 ghost-border flex items-center gap-4"
          >
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
              kneeStatus === 'verde' ? 'bg-secondary/10 border border-secondary/20' :
              kneeStatus === 'amarelo' ? 'bg-[#ffd700]/10 border border-[#ffd700]/20' :
              'bg-primary/10 border border-primary/20'
            )}>
              <ex.icon size={16} className={
                kneeStatus === 'verde' ? 'text-secondary' :
                kneeStatus === 'amarelo' ? 'text-[#ffd700]' :
                'text-primary'
              } />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-on-surface truncate">{ex.name}</p>
              <div className="flex items-center gap-3 mt-0.5">
                {ex.sets !== '—' && <span className="text-[10px] text-on-surface-variant">{ex.sets} séries</span>}
                {ex.rest !== '—' && <span className="text-[10px] text-on-surface-variant">Descanso: {ex.rest}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hashimoto warning */}
      <div className="glass-card rounded-2xl p-4 ghost-border float-up-d3">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle size={13} className="text-tertiary" />
          <p className="text-[10px] uppercase tracking-widest text-tertiary font-semibold">Hashimoto — Alerta</p>
        </div>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Evite treino de alta intensidade em dias de fadiga extrema. Priorize consistência sobre intensidade. Monitore frequência cardíaca.
        </p>
      </div>
    </div>
  );
}
