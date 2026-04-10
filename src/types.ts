export interface Profile {
  nome: string;
  altura_m: number;
  peso_inicial_kg: number;
  imc_inicial: number;
  condicao_saude: string;
  protocolo_farmaco: string;
  restricoes_articulares: string;
  data_inicio: string;
}

export interface HashimotoRules {
  bociogenicos: {
    alimentos: string[];
    regra_obrigatoria: string;
    justificativa: string;
  };
  soja: {
    regra: string;
    motivo: string;
  };
  gluten: {
    regra: string;
    sugestao: string;
  };
  anti_inflamatorios_naturais: {
    priorizar: string[];
  };
}

export interface Meal {
  horario: string;
  obrigatorios?: string[];
  opcionais?: string[];
  exemplos: string[];
  prioridade?: string;
  status?: string;
  composicao?: Record<string, string>;
  opcoes_leves?: string[];
  regra?: string;
}

export interface Exercise {
  frequencia: string;
  duracao: string;
  intensidade?: string;
  superficie?: string;
  calcado?: string;
  horarios_sugeridos?: string[];
  reducao?: string;
  foco?: string[];
  exercicios?: string[];
  series?: string;
  impacto_joelho?: string;
}

export interface Protocol {
  name: string;
  version: string;
  profile: Profile;
  regras_hashimoto: HashimotoRules;
  protocolo_wegovy: {
    efeitos_esperados: string[];
    adaptacoes_nutricionais: Record<string, string>;
  };
  suplementacao_diaria: Record<string, any>;
  estrutura_refeicoes: Record<string, Meal>;
  protocolo_exercicios: {
    fase_atual: string;
    restricoes: Record<string, string>;
    caminhada: Exercise;
    exercicios_complementares: Record<string, Exercise>;
    progressao_semanal: Record<string, string>;
  };
  checklist_diario: Array<{
    id: string;
    descricao: string;
    categoria: string;
    obrigatorio: boolean;
  }>;
  monitoramento: {
    diario: Record<string, any>;
    semanal: Record<string, any>;
  };
  alertas_seguranca: Record<string, string[]>;
  substituicoes_inteligentes: Record<string, Record<string, string[]>>;
  prompt_ia_assistente: string;
}

export type Mood = 'otima' | 'bem' | 'regular' | 'cansada' | 'enjoo';
export type KneeStatus = 'verde' | 'amarelo' | 'vermelho';
export type Symptom = 'nausea' | 'tontura' | 'fadiga' | 'dor_cabeca';

export interface DailyMealLog {
  completed: boolean;
  photoDataUrl?: string;
}

export interface DailyLog {
  date: string;
  hydrationLiters: number;
  checklist: Record<string, boolean>;
  mood: Mood;
  dailyScore: number;
  note: string;
  symptoms: Symptom[];
  weightKg?: number;
  kneeStatus: KneeStatus;
  mealLogs: Record<string, DailyMealLog>;
}

export interface ReminderConfig {
  enabled: boolean;
  hydrationEveryMinutes: number;
  supplementTime: string;
  walkMorningTime: string;
  walkAfternoonTime: string;
}

export interface AppData {
  version: number;
  logs: Record<string, DailyLog>;
  reminderConfig: ReminderConfig;
}
