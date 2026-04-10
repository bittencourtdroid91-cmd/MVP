import { Activity, Droplets, Flame, Trophy, TrendingUp, Zap } from 'lucide-react';
import { DailyLog, Profile } from '../types';
import { cn } from '../lib/utils';

interface VitalsScreenProps {
  profile: Profile;
  todayLabel: string;
  log: DailyLog;
  waterGoal: number;
  streakDays: number;
  monthlyAverage: number;
  monthlyBadge: string;
  weeklyLogs: DailyLog[];
  onAddWater: (liters: number) => void;
}

const greetingByHour = (): string => {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
};

const getScoreColor = (score: number): string => {
  if (score >= 8) return 'text-gradient-secondary';
  if (score >= 5) return 'text-gradient-primary';
  return 'text-gradient-violet';
};

const badgeClass: Record<string, string> = {
  Bronze: 'badge-bronze', Prata: 'badge-silver', Ouro: 'badge-gold', Diamante: 'badge-diamond',
};

export default function VitalsScreen({
  profile, todayLabel, log, waterGoal, streakDays, monthlyAverage, monthlyBadge, weeklyLogs, onAddWater,
}: VitalsScreenProps) {
  const hydrationPct = Math.min(100, (log.hydrationLiters / waterGoal) * 100);
  const weeklyMax = Math.max(1, ...weeklyLogs.map((e) => e.dailyScore));
  const scoreIsCalibrating = log.dailyScore === 0;

  return (
    <div className="space-y-6 pb-4">
      {/* Hero greeting */}
      <section className="pt-2 float-up">
        <p className="text-xs uppercase tracking-[0.25em] text-secondary font-medium">
          {greetingByHour()} · <span className="capitalize">{todayLabel}</span>
        </p>
        <h2 className="font-serif text-4xl font-bold mt-1 leading-tight text-on-surface">
          Olá, {profile.nome}
        </h2>
        <p className="text-sm text-on-surface-variant mt-1">
          {scoreIsCalibrating ? 'O laboratório está pronto. Registre suas atividades.' : 'Seus indicadores vitais estão sendo atualizados.'}
        </p>
      </section>

      {/* Score + Hydration row */}
      <div className="grid grid-cols-2 gap-3 float-up-d1">
        {/* Daily Score */}
        <div className="glass-card rounded-3xl p-5 glow-primary col-span-1 ghost-border">
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold mb-1">Score do Dia</p>
          <p className="text-[10px] uppercase tracking-wider text-on-surface-variant/60 mb-2">Integridade sistêmica</p>
          <div className={cn('font-serif text-5xl font-bold leading-none', getScoreColor(log.dailyScore))}>
            {log.dailyScore.toFixed(1)}
          </div>
          <p className="text-on-surface-variant text-xs mt-0.5">/ 10</p>

          <div className="mt-3 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className={cn('h-full rounded-full transition-all duration-700', log.dailyScore >= 5 ? 'primary-bar' : 'bg-surface-container-highest')}
              style={{ width: `${(log.dailyScore / 10) * 100}%` }}
            />
          </div>

          {scoreIsCalibrating && (
            <div className="mt-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <p className="text-[9px] uppercase tracking-widest text-on-surface-variant">Aguardando calibração</p>
            </div>
          )}
        </div>

        {/* Streak + Badge */}
        <div className="flex flex-col gap-3">
          <div className="glass-card rounded-3xl p-4 ghost-border glow-secondary flex-1">
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold mb-1">Streak</p>
            <div className="flex items-end gap-1">
              <span className="font-serif text-3xl font-bold text-gradient-secondary">{streakDays}</span>
              <span className="text-secondary text-sm mb-0.5">dias</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Flame size={11} className="text-primary" />
              <p className="text-[9px] text-on-surface-variant">Meta: score &gt; {7}</p>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-4 ghost-border flex-1">
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold mb-1">Ranking</p>
            <span className={cn('font-serif text-2xl font-bold', badgeClass[monthlyBadge] || 'text-on-surface')}>
              {monthlyAverage.toFixed(1)}
            </span>
            <div className="flex items-center gap-1 mt-1">
              <Trophy size={11} className={badgeClass[monthlyBadge] || 'text-on-surface-variant'} />
              <span className={cn('text-[9px] uppercase tracking-widest font-bold', badgeClass[monthlyBadge] || 'text-on-surface-variant')}>
                {monthlyBadge}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hydration card */}
      <div className="glass-card rounded-3xl p-5 ghost-border glow-secondary float-up-d2">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-secondary font-semibold mb-1">Hidratação</p>
            <div className="flex items-end gap-1.5">
              <span className="font-serif text-3xl font-bold text-gradient-secondary">{log.hydrationLiters.toFixed(2)}</span>
              <span className="text-on-surface-variant text-sm mb-0.5">L / {waterGoal}L</span>
            </div>
            <p className="text-[10px] text-on-surface-variant mt-0.5">{Math.round(hydrationPct)}% da meta diária</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center border border-secondary/20">
            <Droplets className="text-secondary" size={18} />
          </div>
        </div>

        {/* Liquid progress */}
        <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden mb-4">
          <div
            className="h-full liquid-bar transition-all duration-700"
            style={{ width: `${hydrationPct}%` }}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onAddWater(-0.25)}
            className="px-4 py-2.5 rounded-2xl bg-surface-container-high ghost-border text-on-surface-variant text-xs font-semibold hover:bg-surface-container-highest transition-colors"
          >
            −250ml
          </button>
          <button
            onClick={() => onAddWater(0.25)}
            className="flex-1 py-2.5 rounded-2xl bg-secondary text-on-secondary font-bold text-xs tracking-widest glow-secondary-strong hover:bg-secondary/90 transition-all"
          >
            + 250ml
          </button>
          <button
            onClick={() => onAddWater(0.5)}
            className="px-4 py-2.5 rounded-2xl bg-secondary/20 text-secondary ghost-border text-xs font-bold hover:bg-secondary/30 transition-colors"
          >
            +500ml
          </button>
        </div>
      </div>

      {/* 7-day trend */}
      <div className="glass-card rounded-3xl p-5 ghost-border float-up-d3">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold">Variância Vital</p>
            <h3 className="font-serif text-lg font-bold mt-0.5">Tendência 7 Dias</h3>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-[10px] text-on-surface-variant">Atividade</span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1.5 items-end h-32">
          {weeklyLogs.map((entry, i) => {
            const heightPct = Math.max(8, (entry.dailyScore / weeklyMax) * 100);
            const day = entry.date.slice(8, 10);
            const isToday = i === weeklyLogs.length - 1;
            return (
              <div key={entry.date} className="flex flex-col items-center gap-1.5">
                <div className="w-full bg-surface-container-highest rounded-lg overflow-hidden h-24 flex items-end">
                  <div
                    className={cn('w-full rounded-lg transition-all duration-500', isToday ? 'primary-bar' : 'bg-surface-container-high')}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <span className={cn('text-[9px] font-medium', isToday ? 'text-primary' : 'text-on-surface-variant')}>
                  {day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-3 gap-3 float-up-d4">
        {[
          { label: 'Checklist', value: `${Object.values(log.checklist).filter(Boolean).length}/${Object.values(log.checklist).length || '–'}`, icon: Activity, color: 'text-primary' },
          { label: 'Humor', value: log.mood.charAt(0).toUpperCase() + log.mood.slice(1), icon: Zap, color: 'text-tertiary' },
          { label: 'Sintomas', value: log.symptoms.length === 0 ? 'Nenhum' : `${log.symptoms.length}`, icon: TrendingUp, color: 'text-secondary' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-2xl p-4 ghost-border text-center">
            <stat.icon size={16} className={cn('mx-auto mb-2', stat.color)} />
            <p className={cn('font-semibold text-sm', stat.color)}>{stat.value}</p>
            <p className="text-[9px] uppercase tracking-widest text-on-surface-variant mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
