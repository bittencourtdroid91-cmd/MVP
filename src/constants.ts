import { Protocol } from "./types";

export const PROTOCOL_DATA: Protocol = {
  "name": "Protocolo Maelly - Motor de Geração",
  "version": "1.0",
  "profile": {
    "nome": "Maelly",
    "altura_m": 1.64,
    "peso_inicial_kg": 102,
    "imc_inicial": 37.9,
    "condicao_saude": "Hashimoto sem medicação (sem levotiroxina)",
    "protocolo_farmaco": "Wegovy (semaglutida) + Whey Protein",
    "restricoes_articulares": "Joelho sensível - evitar impacto",
    "data_inicio": "2026-04-06"
  },
  "regras_hashimoto": {
    "bociogenicos": {
      "alimentos": ["brócolis", "couve", "couve-flor", "repolho", "couve-de-bruxelas", "nabo", "rabanete"],
      "regra_obrigatoria": "SEMPRE cozidos/vapor/assados. NUNCA crus.",
      "justificativa": "Cozimento inativa compostos bociogênicos que interferem na tireoide"
    },
    "soja": {
      "regra": "Limitar/excluir",
      "motivo": "Pode interferir na absorção hormonal e inflamação"
    },
    "gluten": {
      "regra": "Preferir integrais, observar sensibilidade",
      "sugestao": "Arroz integral, quinoa, aveia sem glúten se sensível"
    },
    "anti_inflamatorios_naturais": {
      "priorizar": ["cúrcuma", "gengibre", "ômega-3", "frutas vermelhas", "azeite extravirgem", "chá verde"]
    }
  },
  "protocolo_wegovy": {
    "efeitos_esperados": [
      "Redução significativa de apetite (especialmente semanas 1-4)",
      "Náuseas possíveis (evitar refeições muito gordurosas)",
      "Saciedade acelerada",
      "Possível perda de apetite para jantar"
    ],
    "adaptacoes_nutricionais": {
      "foco_refeicoes": "Almoço é refeição principal (não pular)",
      "jantar": "Opcional - pode ser substituído por whey + frutas se sem fome",
      "hidratacao": "Crítica - mínimo 2L/dia (Wegovy desidrata)",
      "proteina": "Prioridade absoluta - preservar massa magra",
      "fracionamento": "Pequenas porções, mastigar bem"
    }
  },
  "suplementacao_diaria": {
    "creatina": {
      "dose": "3-5g",
      "horario": "Ao acordar ou pós-treino",
      "como_tomar": "Dissolver em água, whey ou iogurte",
      "hashimoto_seguro": true,
      "beneficios": ["Preservação muscular", "Energia celular", "Sem contra-indicação tireoide"]
    },
    "whey_protein": {
      "dose": "1-2 doses/dia (20-30g cada)",
      "horarios_sugeridos": ["Café da manhã", "Lanche tarde", "Substituto jantar (se sem fome)"],
      "tipo_recomendado": "Isolado ou hidrolisado (menor lactose)",
      "hashimoto_seguro": true
    },
    "agua": {
      "meta_diaria_litros": 2,
      "alerta": "Wegovy aumenta necessidade hídrica"
    }
  },
  "estrutura_refeicoes": {
    "cafe_manha": {
      "horario": "07:00",
      "obrigatorios": ["Proteína (whey/ovos/iogurte)", "Fruta baixa glicêmica"],
      "opcionais": ["Creatina", "Chá verde", "Castanhas (pequena porção)"],
      "exemplos": [
        "Whey + banana + 1 col chia",
        "Iogurte natural + morangos + 1 col farelo aveia",
        "2 ovos mexidos + 1 fatia pão integral + café"
      ]
    },
    "almoco": {
      "horario": "12:00",
      "prioridade": "REFEIÇÃO PRINCIPAL - não pular",
      "composicao": {
        "proteina": "150-200g (frango/peixe/ovos/carne magra)",
        "vegetais_cozidos": "Brócolis/couve-flor/cenoura/abobrinha (SEMPRE cozidos)",
        "carboidrato": "3-4 col arroz integral/quinoa/batata-doce",
        "gordura_boa": "1 col azeite extravirgem"
      },
      "exemplos": [
        "Frango grelhado + brócolis cozido + arroz integral + salada folhas",
        "Peixe assado + abobrinha refogada + quinoa",
        "Omelete 3 ovos + espinafre cozido + batata-doce"
      ]
    },
    "jantar": {
      "horario": "19:00",
      "status": "OPCIONAL (Wegovy pode retirar fome)",
      "opcoes_leves": [
        "Sopa de legumes (sem batata, com frango desfiado)",
        "Whey + frutas vermelhas + 1 col chia",
        "Salada de folhas + atum + azeite",
        "Ovos cozidos + vegetais cozidos"
      ],
      "regra": "Se sem fome, pular sem culpa. Focar em proteína se comer.",
      "exemplos": ["Omelete de claras", "Sopa de abóbora com frango"]
    }
  },
  "protocolo_exercicios": {
    "fase_atual": "Adaptação (semanas 1-4)",
    "restricoes": {
      "joelho": "Evitar impacto, corrida, agachamento profundo, subir/descer escadas excessivo",
      "intensidade": "Leve a moderada - consistência > intensidade",
      "dor": "Se dor durante exercício, parar imediatamente"
    },
    "caminhada": {
      "frequencia": "2×/dia",
      "duracao": "20 minutos cada",
      "intensidade": "Leve - consegue conversar enquanto caminha",
      "superficie": "Plana e regular (evitar terrenos irregulares)",
      "calcado": "Tênis com bom amortecimento",
      "horarios_sugeridos": ["09:00 manhã", "16:00 tarde"],
      "reducao": "Se dor/nojo excessivo, reduzir para 1×/dia na semana 1"
    },
    "exercicios_complementares": {
      "alongamento": {
        "frequencia": "Diário",
        "duracao": "10 min",
        "foco": ["Panturrilha", "Posterior coxa", "Quadríceps leve"]
      },
      "fortalecimento_superior": {
        "frequencia": "2-3×/semana",
        "duracao": "15-20 min",
        "exercicios": ["Elevação lateral braços", "Flexão parede", "Remada elástico"],
        "series": "2×10-12 repetições",
        "impacto_joelho": "Zero"
      }
    },
    "progressao_semanal": {
      "semana_1": "Caminhada 2×20min + alongamento",
      "semana_2": "Caminhada 2×25min + fortalecimento superior",
      "semana_3": "Caminhada 2×30min + fortalecimento",
      "semana_4": "Avaliar evolução - considerar hidroginástica ou bicicleta ergométrica"
    }
  },
  "checklist_diario": [
    {
      "id": "creatina",
      "descricao": "Creatina 3-5g",
      "categoria": "Suplementação",
      "obrigatorio": true
    },
    {
      "id": "whey",
      "descricao": "Whey protein 1-2×",
      "categoria": "Suplementação",
      "obrigatorio": true
    },
    {
      "id": "agua",
      "descricao": "2L água",
      "categoria": "Hidratação",
      "obrigatorio": true
    },
    {
      "id": "almoco",
      "descricao": "Almoço completo (proteína + vegetais cozidos)",
      "categoria": "Nutrição",
      "obrigatorio": true
    },
    {
      "id": "caminhada_manha",
      "descricao": "Caminhada 20min manhã",
      "categoria": "Exercício",
      "obrigatorio": true
    },
    {
      "id": "caminhada_tarde",
      "descricao": "Caminhada 20min tarde",
      "categoria": "Exercício",
      "obrigatorio": true
    }
  ],
  "monitoramento": {
    "diario": {
      "peso": "Mesmo horário, jejum, após urinar",
      "humor": ["Ótima 🌟", "Bem 😊", "Regular 😐", "Cansada 😴", "Com enjoo 🤢"],
      "nota_dia": "0-10 (adesão protocolo)",
      "sintomas_wegovy": ["Náusea", "Tontura", "Fadiga", "Dor cabeça"]
    },
    "semanal": {
      "medidas_corporais": ["Cintura", "Quadril", "Busto", "Coxa"],
      "fotos": "Mesma luz/posição (opcional)",
      "avaliacao_energia": "Escala 1-10",
      "qualidade_sono": "Horas e qualidade"
    }
  },
  "alertas_seguranca": {
    "hashimoto": [
      "NUNCA consumir brócolis/couve/repolho crus",
      "Evitar soja em excesso",
      "Observar fadiga extrema (pode ser tireoide)",
      "Manter acompanhamento médico"
    ],
    "wegovy": [
      "Hidratação crítica - mínimo 2L",
      "Proteína suficiente para preservar músculo",
      "Náuseas: evitar gorduras, comer devagar",
      "Tontura: levantar devagar, comer algo"
    ],
    "joelho": [
      "Dor durante exercício = PARAR",
      "Superfície plana obrigatória",
      "Tênis adequado com amortecimento",
      "Gelo 15min se inflamação"
    ]
  },
  "substituicoes_inteligentes": {
    "proteinas": {
      "frango": ["peixe", "ovos", "carne magra", "peru"],
      "whey": ["iogurte natural", "ovos", "queijo cottage"],
      "ovos": ["whey", "atum", "frango desfiado"]
    },
    "carboidratos": {
      "arroz_integral": ["quinoa", "batata-doce", "aveia", "pão integral"],
      "banana": ["maçã", "morangos", "pera", "mamão"]
    },
    "vegetais_cozidos": {
      "brócolis": ["couve-flor", "cenoura", "abobrinha", "chuchu", "vagem"],
      "couve": ["espinafre cozido", "acelga", "rúcula (cozida)"]
    }
  },
  "prompt_ia_assistente": "Você é um assistente de protocolo de saúde especializado em Hashimoto + Wegovy. Sua paciente é Maelly, 1.64m, 102kg inicial, Hashimoto SEM medicação, usando Wegovy. REGRAS OBRIGATÓRIAS: 1) Brócolis/couve/repolho SEMPRE cozidos, nunca crus. 2) Foco em proteína para preservar massa magra. 3) Hidratação mínima 2L. 4) Exercícios: apenas caminhada leve 2×/dia, joelho sensível, sem impacto. 5) Jantar opcional (Wegovy tira fome). 6) Creatina + whey diários. Priorize segurança tireoidiana e adaptação ao Wegovy. Seja encorajador mas rigoroso nas regras Hashimoto."
};
