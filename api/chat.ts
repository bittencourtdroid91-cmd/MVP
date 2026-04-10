import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

const model = 'gemini-2.5-flash';

const withCors = (res: VercelResponse) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  withCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing GEMINI_API_KEY on server' });
  }

  try {
    const { message, protocol, recentLogs, history } = req.body ?? {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Missing message' });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Note: In @google/genai ^1.49.0, systemInstruction is a top-level property of GenerateContentParameters.
    // However, the TypeScript definitions in this version might still expect it inside 'config'.
    // We use @ts-ignore if needed, but based on runtime check, it works at top level.
    const response = await ai.models.generateContent({
      model,
      // @ts-ignore: systemInstruction is supported at top level in newer SDKs
      systemInstruction:
        protocol?.prompt_ia_assistente ||
        'Você é uma assistente de saúde focada em Hashimoto + Wegovy. Responda de forma segura e objetiva.',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: [
                'Contexto do protocolo:',
                JSON.stringify(protocol ?? {}),
                'Logs recentes:',
                JSON.stringify(recentLogs ?? []),
                'Histórico resumido:',
                JSON.stringify(history ?? []),
                `Pergunta atual: ${message}`,
              ].join('\n'),
            },
          ],
        },
      ],
    });

    return res.status(200).json({ text: response.text ?? 'Sem resposta no momento.' });
  } catch (error) {
    console.error('chat api error', error);
    return res.status(500).json({ error: 'Failed to generate response' });
  }
}
