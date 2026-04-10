export const toISODate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const todayISO = (): string => toISODate(new Date());

export const formatPtDateLong = (isoDate: string): string => {
  const date = new Date(`${isoDate}T12:00:00`);
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

export const lastNDates = (days: number, from = new Date()): string[] => {
  return Array.from({ length: days }).map((_, index) => {
    const d = new Date(from);
    d.setDate(from.getDate() - (days - 1 - index));
    return toISODate(d);
  });
};
