import { useEffect, useMemo, useState } from 'react';
import { Bell, Settings, Activity, Utensils, Dumbbell, FileText, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import VitalsScreen from './components/VitalsScreen';
import MealScreen from './components/MealScreen';
import WorkoutScreen from './components/WorkoutScreen';
import NotesScreen from './components/NotesScreen';
import AIAssistant from './components/AIAssistant';
import SettingsPanel from './components/SettingsPanel';
import { PROTOCOL_DATA } from './constants';
import { AppData, DailyLog, KneeStatus, Mood, Symptom } from './types';
import { formatPtDateLong, lastNDates, todayISO, toISODate } from './lib/date';
import { createDailyLog, exportBackup, importBackupFile, loadAppData, saveAppData } from './lib/storage';

type Screen = 'vitals' | 'meal' | 'workout' | 'notes';
type AppPhase = 'splash' | 'app';

const WATER_GOAL = Number(PROTOCOL_DATA.suplementacao_diaria.agua.meta_diaria_litros) || 2;
const SCORE_TARGET = 7;

const moodPoints: Record<Mood, number> = {
  otima: 2, bem: 1.6, regular: 1.2, cansada: 0.8, enjoo: 0.4,
};

const getTodayNotificationPermission = (): NotificationPermission | 'unsupported' => {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
  return Notification.permission;
};

const calculateScore = (log: DailyLog): number => {
  const checklistValues = Object.values(log.checklist);
  const checklistRatio = checklistValues.length ? checklistValues.filter(Boolean).length / checklistValues.length : 0;
  const checklistScore = checklistRatio * 6;
  const hydrationScore = Math.min(log.hydrationLiters / WATER_GOAL, 1) * 2;
  const moodScore = moodPoints[log.mood];
  const symptomPenalty = Math.min(1.5, log.symptoms.length * 0.3);
  return Number(Math.max(0, Math.min(10, checklistScore + hydrationScore + moodScore - symptomPenalty)).toFixed(1));
};

const resolveBadge = (average: number): string => {
  if (average >= 9) return 'Diamante';
  if (average >= 7.5) return 'Ouro';
  if (average >= 5) return 'Prata';
  return 'Bronze';
};

function SplashScreen({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 400);
    const t2 = setTimeout(() => setStep(2), 900);
    const t3 = setTimeout(() => setStep(3), 1400);
    const t4 = setTimeout(() => onDone(), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onDone]);

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center particle-bg overflow-hidden">
      {/* ambient orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-64 h-64 rounded-full bg-secondary/6 blur-3xl pointer-events-none" />

      <div className="flex flex-col items-center gap-6 relative z-10">
        {/* Logo mark */}
        <div className="relative">
          {step >= 1 && (
            <div className="absolute inset-0 rounded-full border border-primary/30 pulse-ring" />
          )}
          <div className={cn(
            "w-20 h-20 rounded-full bg-surface-container flex items-center justify-center ghost-border transition-all duration-500",
            step >= 1 ? "opacity-100 scale-100 glow-primary-strong" : "opacity-0 scale-75"
          )}>
            <span className="font-serif text-4xl font-bold text-gradient-primary italic">V</span>
          </div>
        </div>

        {/* Wordmark */}
        <div className={cn("text-center transition-all duration-500", step >= 2 ? "opacity-100" : "opacity-0")}>
          <h1 className="font-serif text-5xl font-bold italic text-gradient-primary tracking-tight">VITALIS</h1>
          <p className="text-xs uppercase tracking-[0.35em] text-secondary mt-2">THE CELESTIAL LABORATORY</p>
        </div>

        {/* Loading status */}
        <div className={cn("text-center mt-4 transition-all duration-500", step >= 3 ? "opacity-100" : "opacity-0")}>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto mb-3" />
          <p className="text-[11px] uppercase tracking-widest text-on-surface-variant">Inicializando protocolo</p>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            <p className="text-[10px] uppercase tracking-widest text-secondary">Calibrando biometricos...</p>
          </div>
        </div>
      </div>

      {/* Bottom established */}
      <p className={cn(
        "absolute bottom-10 text-[10px] uppercase tracking-[0.4em] text-on-surface-variant/40 transition-all duration-500",
        step >= 2 ? "opacity-100" : "opacity-0"
      )}>ESTABLISHED MMXXIV</p>
    </div>
  );
}

export default function App() {
  const [phase, setPhase] = useState<AppPhase>('splash');
  const [activeScreen, setActiveScreen] = useState<Screen>('vitals');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [appData, setAppData] = useState<AppData>(() => loadAppData());
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | 'unsupported'>(
    getTodayNotificationPermission()
  );

  const today = todayISO();

  useEffect(() => {
    if (!appData.logs[today]) {
      setAppData((prev) => ({ ...prev, logs: { ...prev.logs, [today]: createDailyLog(today) } }));
    }
  }, [appData.logs, today]);

  useEffect(() => { saveAppData(appData); }, [appData]);

  const currentLog = appData.logs[today] ?? createDailyLog(today);

  const updateTodayLog = (updater: (log: DailyLog) => DailyLog) => {
    setAppData((prev) => {
      const current = prev.logs[today] ?? createDailyLog(today);
      const next = updater(current);
      const withScore = { ...next, dailyScore: calculateScore(next) };
      return { ...prev, logs: { ...prev.logs, [today]: withScore } };
    });
  };

  const weeklyLogs = useMemo(() => lastNDates(7).map((date) => appData.logs[date] ?? createDailyLog(date)), [appData.logs]);
  const previousWeekDate = useMemo(() => { const d = new Date(); d.setDate(d.getDate() - 7); return toISODate(d); }, []);
  const previousWeekLog = appData.logs[previousWeekDate];

  const streakDays = useMemo(() => {
    let streak = 0;
    const cursor = new Date();
    while (true) {
      const key = toISODate(cursor);
      const log = appData.logs[key];
      if (!log || log.dailyScore < SCORE_TARGET) break;
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  }, [appData.logs]);

  const monthlyAverage = useMemo(() => {
    const currentMonth = today.slice(0, 7);
    const monthLogs = Object.values(appData.logs).filter((log) => log.date.startsWith(currentMonth));
    if (!monthLogs.length) return 0;
    return monthLogs.reduce((sum, log) => sum + log.dailyScore, 0) / monthLogs.length;
  }, [appData.logs, today]);

  const monthlyBadge = resolveBadge(monthlyAverage);
  const recentLogs = useMemo(() => weeklyLogs.slice(-5), [weeklyLogs]);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) { setNotificationPermission('unsupported'); return; }
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
  };

  useEffect(() => {
    if (!appData.reminderConfig.enabled) return;
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const sentKey = `vitalis.reminders.${today}`;
    const sentMap = new Set<string>(JSON.parse(localStorage.getItem(sentKey) || '[]'));
    const markSent = (tag: string) => { sentMap.add(tag); localStorage.setItem(sentKey, JSON.stringify(Array.from(sentMap))); };
    const notify = (title: string, body: string, tag: string) => { if (sentMap.has(tag)) return; new Notification(title, { body, tag }); markSent(tag); };
    const hydrationTimer = window.setInterval(() => { new Notification('Vitalis: hidratação', { body: 'Beba 250ml de água.', tag: `hydration-${Date.now()}` }); }, appData.reminderConfig.hydrationEveryMinutes * 60 * 1000);
    const scheduleTimer = window.setInterval(() => {
      const now = new Date();
      const hhmm = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
      if (hhmm === appData.reminderConfig.supplementTime) notify('Vitalis: suplementos', 'Hora de creatina e whey.', 'supplement');
      if (hhmm === appData.reminderConfig.walkMorningTime) notify('Vitalis: caminhada manhã', 'Inicie sua caminhada leve de 20 min.', 'walk-morning');
      if (hhmm === appData.reminderConfig.walkAfternoonTime) notify('Vitalis: caminhada tarde', 'Hora da segunda caminhada leve.', 'walk-afternoon');
    }, 30 * 1000);
    return () => { clearInterval(hydrationTimer); clearInterval(scheduleTimer); };
  }, [appData.reminderConfig, today]);

  const navItems = [
    { id: 'vitals', label: 'Sinais', icon: Activity },
    { id: 'meal', label: 'Refeição', icon: Utensils },
    { id: 'workout', label: 'Treino', icon: Dumbbell },
    { id: 'notes', label: 'Notas', icon: FileText },
  ];

  const renderScreen = () => {
    switch (activeScreen) {
      case 'vitals': return (
        <VitalsScreen
          profile={PROTOCOL_DATA.profile}
          todayLabel={formatPtDateLong(today)}
          log={currentLog}
          waterGoal={WATER_GOAL}
          streakDays={streakDays}
          monthlyAverage={monthlyAverage}
          monthlyBadge={monthlyBadge}
          weeklyLogs={weeklyLogs}
          onAddWater={(liters) => updateTodayLog((log) => ({ ...log, hydrationLiters: Math.max(0, Number((log.hydrationLiters + liters).toFixed(2))) }))}
          onChecklistToggle={(id, checked) => updateTodayLog((log) => ({ ...log, checklist: { ...log.checklist, [id]: checked } }))}
        />
      );
      case 'meal': return (
        <MealScreen
          log={currentLog}
          previousWeekLog={previousWeekLog}
          substitutions={PROTOCOL_DATA.substituicoes_inteligentes}
          onMealToggle={(mealId, completed) => updateTodayLog((log) => ({ ...log, mealLogs: { ...log.mealLogs, [mealId]: { ...(log.mealLogs[mealId] ?? { completed: false }), completed } } }))}
          onMealPhoto={(mealId, photoDataUrl) => updateTodayLog((log) => ({ ...log, mealLogs: { ...log.mealLogs, [mealId]: { ...(log.mealLogs[mealId] ?? { completed: false }), photoDataUrl } } }))}
        />
      );
      case 'workout': return (
        <WorkoutScreen
          kneeStatus={currentLog.kneeStatus}
          onKneeStatusChange={(status: KneeStatus) => updateTodayLog((log) => ({ ...log, kneeStatus: status }))}
        />
      );
      case 'notes': return (
        <NotesScreen
          log={currentLog}
          checklistItems={PROTOCOL_DATA.checklist_diario}
          onMoodChange={(mood: Mood) => updateTodayLog((log) => ({ ...log, mood }))}
          onSymptomsChange={(symptoms: Symptom[]) => updateTodayLog((log) => ({ ...log, symptoms }))}
          onNoteChange={(note: string) => updateTodayLog((log) => ({ ...log, note }))}
          onWeightChange={(weightKg) => updateTodayLog((log) => ({ ...log, weightKg }))}
          onChecklistToggle={(id, checked) => updateTodayLog((log) => ({ ...log, checklist: { ...log.checklist, [id]: checked } }))}
          onExportBackup={() => exportBackup(appData)}
          onImportBackup={async (file: File) => { const imported = await importBackupFile(file); setAppData(imported); }}
          onGenerateReport={async () => { const module = await import('./lib/report'); module.generateWeeklyReport(appData, PROTOCOL_DATA.profile.nome); }}
        />
      );
      default: return null;
    }
  };

  if (phase === 'splash') {
    return <SplashScreen onDone={() => setPhase('app')} />;
  }

  return (
    <div className="min-h-screen bg-background text-on-surface pb-36 particle-bg">
      {/* Header */}
      <header className="fixed top-0 w-full z-50">
        <div className="flex justify-between items-center px-5 py-4 max-w-xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-surface-container ghost-border flex items-center justify-center glow-primary">
              <span className="font-serif text-lg font-bold italic text-gradient-primary">V</span>
            </div>
            <h1 className="font-serif text-xl font-bold italic text-gradient-primary tracking-tight">Vitalis</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-full bg-surface-container/50 ghost-border flex items-center justify-center hover:bg-surface-container-high transition-colors">
              <Bell className="text-on-surface-variant" size={17} />
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              className="w-9 h-9 rounded-full bg-surface-container/50 ghost-border flex items-center justify-center hover:bg-surface-container-high transition-colors"
            >
              <Settings className="text-on-surface-variant" size={17} />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-20 px-5 max-w-xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScreen}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating bottom nav */}
      <nav className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <div className="nav-pill rounded-full px-3 py-2 flex items-center gap-1 pointer-events-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveScreen(item.id as Screen)}
                className={cn(
                  'flex flex-col items-center justify-center px-4 py-2 rounded-full transition-all duration-300 gap-0.5',
                  isActive
                    ? 'bg-gradient-to-br from-primary-container to-primary-dim text-white glow-primary-strong'
                    : 'text-on-surface-variant hover:text-on-surface'
                )}
              >
                <Icon size={isActive ? 20 : 19} />
                <span className={cn('text-[9px] uppercase tracking-widest font-semibold leading-none transition-all',
                  isActive ? 'opacity-100 max-h-4' : 'opacity-0 max-h-0 overflow-hidden'
                )}>{item.label}</span>
              </button>
            );
          })}

          {/* AI quick access button */}
          <div className="w-px h-5 bg-outline-variant mx-1" />
          <AIAssistant protocol={PROTOCOL_DATA} recentLogs={recentLogs} inlineButton />
        </div>
      </nav>

      <SettingsPanel
        isOpen={settingsOpen}
        reminderConfig={appData.reminderConfig}
        notificationPermission={notificationPermission}
        onClose={() => setSettingsOpen(false)}
        onRequestPermission={requestNotificationPermission}
        onConfigChange={(next) => setAppData((prev) => ({ ...prev, reminderConfig: next }))}
      />
    </div>
  );
}
