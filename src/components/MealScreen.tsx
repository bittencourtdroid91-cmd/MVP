import { useMemo, useState, useRef } from 'react';
import { Camera, CheckCircle2, Clock, Flame, ChevronRight, X } from 'lucide-react';
import { DailyLog } from '../types';
import { cn } from '../lib/utils';

interface Recipe {
  id: string;
  type: string;
  time: string;
  name: string;
  kcal: number;
  min: number;
  img: string;
  color: string;
}

const recipes: Recipe[] = [
  {
    id: 'cafe',
    type: 'Café da Manhã',
    time: '07:00',
    name: 'Whey + Fruta de baixa carga glicêmica',
    kcal: 320,
    min: 5,
    img: 'https://images.unsplash.com/photo-1632101588461-1f85a93fef9f?auto=format&fit=crop&w=700&q=80',
    color: 'primary',
  },
  {
    id: 'almoco',
    type: 'Almoço',
    time: '12:00',
    name: 'Proteína + Vegetais cozidos + Carbo inteligente',
    kcal: 540,
    min: 25,
    img: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=700&q=80',
    color: 'secondary',
  },
  {
    id: 'jantar',
    type: 'Jantar (opcional)',
    time: '19:00',
    name: 'Sopa leve ou Whey com frutas vermelhas',
    kcal: 280,
    min: 15,
    img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=700&q=80',
    color: 'tertiary',
  },
];

interface MealScreenProps {
  log: DailyLog;
  previousWeekLog?: DailyLog;
  substitutions: Record<string, Record<string, string[]>>;
  onMealToggle: (mealId: string, completed: boolean) => void;
  onMealPhoto: (mealId: string, photoDataUrl: string) => void;
}

export default function MealScreen({ log, previousWeekLog, substitutions, onMealToggle, onMealPhoto }: MealScreenProps) {
  const [expandedMealId, setExpandedMealId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoTargetId, setPhotoTargetId] = useState<string | null>(null);

  const completedCount = recipes.filter((r) => log.mealLogs[r.id]?.completed).length;
  const substitutionBlocks = Object.entries(substitutions).slice(0, 2);

  const handlePhotoCapture = (mealId: string) => {
    setPhotoTargetId(mealId);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !photoTargetId) return;
    const reader = new FileReader();
    reader.onload = () => { if (typeof reader.result === 'string') onMealPhoto(photoTargetId, reader.result); };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6 pb-4">
      {/* Header */}
      <section className="pt-2 float-up">
        <p className="text-[10px] uppercase tracking-[0.25em] text-secondary font-medium">PROTOCOLO NUTRICIONAL</p>
        <h2 className="font-serif text-4xl font-bold mt-1 text-on-surface">Refeições</h2>
        <p className="text-sm text-on-surface-variant mt-1">{completedCount} de {recipes.length} refeições registradas hoje</p>
      </section>

      {/* Progress bar */}
      <div className="glass-card rounded-2xl p-4 ghost-border float-up-d1">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold">Adesão do Dia</span>
          <span className="text-sm font-bold text-primary">{Math.round((completedCount / recipes.length) * 100)}%</span>
        </div>
        <div className="h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
          <div className="h-full primary-bar transition-all duration-700" style={{ width: `${(completedCount / recipes.length) * 100}%` }} />
        </div>
      </div>

      {/* Meal cards */}
      <div className="space-y-3 float-up-d2">
        {recipes.map((meal) => {
          const mealLog = log.mealLogs[meal.id];
          const isCompleted = mealLog?.completed ?? false;
          const isExpanded = expandedMealId === meal.id;

          return (
            <div
              key={meal.id}
              className={cn(
                'glass-card rounded-3xl overflow-hidden ghost-border transition-all duration-300',
                isCompleted ? 'glow-secondary' : 'glow-primary'
              )}
            >
              {/* Meal image header */}
              <div className="relative h-36 overflow-hidden">
                <img
                  src={mealLog?.photoDataUrl || meal.img}
                  alt={meal.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />

                {/* Completed badge */}
                {isCompleted && (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-secondary/20 border border-secondary/30 rounded-full px-2.5 py-1 backdrop-blur-sm">
                    <CheckCircle2 size={12} className="text-secondary" />
                    <span className="text-[9px] uppercase tracking-widest text-secondary font-bold">Concluído</span>
                  </div>
                )}

                {/* Time badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1 bg-background/60 rounded-full px-2.5 py-1 backdrop-blur-sm">
                  <Clock size={10} className="text-on-surface-variant" />
                  <span className="text-[9px] text-on-surface-variant">{meal.time}</span>
                </div>

                {/* Bottom info */}
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-secondary font-semibold">{meal.type}</p>
                    <p className="text-white font-semibold text-sm leading-tight mt-0.5">{meal.name}</p>
                  </div>
                </div>
              </div>

              {/* Card body */}
              <div className="p-4">
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Flame size={13} className="text-primary" />
                    <span className="text-xs text-on-surface-variant">{meal.kcal} kcal</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={13} className="text-on-surface-variant" />
                    <span className="text-xs text-on-surface-variant">{meal.min} min</span>
                  </div>
                  <button
                    onClick={() => setExpandedMealId(isExpanded ? null : meal.id)}
                    className="ml-auto flex items-center gap-1 text-xs text-on-surface-variant hover:text-primary transition-colors"
                  >
                    Detalhes <ChevronRight size={13} className={cn('transition-transform', isExpanded && 'rotate-90')} />
                  </button>
                </div>

                {/* Expanded substitutions */}
                {isExpanded && substitutionBlocks.length > 0 && (
                  <div className="mb-3 p-3 bg-surface-container-high rounded-2xl">
                    <p className="text-[9px] uppercase tracking-widest text-on-surface-variant font-semibold mb-2">Substituições Inteligentes</p>
                    {substitutionBlocks.slice(0, 1).map(([category, items]) => (
                      <div key={category}>
                        <p className="text-xs text-primary mb-1 capitalize">{category.replace(/_/g, ' ')}</p>
                        {Object.entries(items).slice(0, 1).map(([original, subs]) => (
                          <div key={original} className="text-xs text-on-surface-variant">
                            <span className="line-through opacity-50">{original}</span>
                            <span className="mx-1 text-secondary">→</span>
                            <span>{(subs as string[]).slice(0, 2).join(', ')}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => handlePhotoCapture(meal.id)}
                    className="w-10 h-10 rounded-2xl bg-surface-container-high ghost-border flex items-center justify-center hover:bg-surface-container-highest transition-colors"
                  >
                    <Camera size={16} className="text-on-surface-variant" />
                  </button>
                  <button
                    onClick={() => onMealToggle(meal.id, !isCompleted)}
                    className={cn(
                      'flex-1 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all duration-300',
                      isCompleted
                        ? 'bg-secondary/15 text-secondary border border-secondary/25 hover:bg-secondary/20'
                        : 'bg-gradient-to-r from-primary-container to-primary-dim text-white glow-primary-strong hover:opacity-90'
                    )}
                  >
                    {isCompleted ? '✓ Registrado' : 'Marcar como feito'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />

      {/* Substitutions panel */}
      {substitutionBlocks.length > 0 && (
        <div className="glass-card rounded-3xl p-5 ghost-border float-up-d3">
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold mb-3">Guia de Substituições</p>
          <div className="space-y-3">
            {substitutionBlocks.map(([category, items]) => (
              <div key={category}>
                <p className="text-xs font-semibold text-primary mb-1.5 capitalize">{category.replace(/_/g, ' ')}</p>
                {Object.entries(items).slice(0, 2).map(([original, subs]) => (
                  <div key={original} className="flex items-start gap-2 text-xs text-on-surface-variant py-1">
                    <span className="text-on-surface-variant/50 line-through min-w-0 flex-shrink-0">{original}</span>
                    <span className="text-secondary">→</span>
                    <span className="text-on-surface">{(subs as string[]).slice(0, 3).join(', ')}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
