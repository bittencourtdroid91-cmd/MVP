import { PROTOCOL_DATA } from '../constants';
import { AppData, DailyLog, ReminderConfig } from '../types';
import { todayISO } from './date';

const STORAGE_KEY = 'vitalis.app.data.v1';
const CURRENT_VERSION = 1;

const defaultReminderConfig: ReminderConfig = {
  enabled: false,
  hydrationEveryMinutes: 90,
  supplementTime: '08:00',
  walkMorningTime: '09:00',
  walkAfternoonTime: '16:00',
};

export const defaultChecklist = (): Record<string, boolean> => {
  return PROTOCOL_DATA.checklist_diario.reduce((acc, item) => {
    acc[item.id] = false;
    return acc;
  }, {} as Record<string, boolean>);
};

export const createDailyLog = (date: string): DailyLog => ({
  date,
  hydrationLiters: 0,
  checklist: defaultChecklist(),
  mood: 'regular',
  dailyScore: 0,
  note: '',
  symptoms: [],
  kneeStatus: 'verde',
  mealLogs: {},
});

const normalize = (data: Partial<AppData>): AppData => {
  const logs = data.logs ?? {};
  const normalizedLogs: Record<string, DailyLog> = {};

  Object.entries(logs).forEach(([date, log]) => {
    normalizedLogs[date] = {
      ...createDailyLog(date),
      ...log,
      checklist: {
        ...defaultChecklist(),
        ...(log?.checklist ?? {}),
      },
      mealLogs: log?.mealLogs ?? {},
      symptoms: log?.symptoms ?? [],
    };
  });

  return {
    version: CURRENT_VERSION,
    logs: normalizedLogs,
    reminderConfig: {
      ...defaultReminderConfig,
      ...(data.reminderConfig ?? {}),
    },
  };
};

export const loadAppData = (): AppData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = normalize({});
      const today = todayISO();
      initial.logs[today] = createDailyLog(today);
      return initial;
    }

    const parsed = JSON.parse(raw) as Partial<AppData>;
    const normalized = normalize(parsed);
    const today = todayISO();
    if (!normalized.logs[today]) {
      normalized.logs[today] = createDailyLog(today);
    }
    return normalized;
  } catch {
    const fallback = normalize({});
    const today = todayISO();
    fallback.logs[today] = createDailyLog(today);
    return fallback;
  }
};

export const saveAppData = (data: AppData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const exportBackup = (data: AppData) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json;charset=utf-8',
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `vitalis-backup-${todayISO()}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
};

export const importBackupFile = async (file: File): Promise<AppData> => {
  const text = await file.text();
  const parsed = JSON.parse(text) as Partial<AppData>;
  return normalize(parsed);
};
