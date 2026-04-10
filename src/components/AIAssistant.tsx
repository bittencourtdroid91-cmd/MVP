import { useState, useRef, useEffect } from 'react';
import { Send, X, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { DailyLog, Protocol } from '../types';
import { cn } from '../lib/utils';

interface AIAssistantProps {
  protocol: Protocol;
  recentLogs: DailyLog[];
  inlineButton?: boolean;
}

interface ChatMessage {
  role: 'user' | 'bot';
  content: string;
}

export default function AIAssistant({ protocol, recentLogs, inlineButton }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'bot', content: 'Olá! Sou sua assistente do protocolo Vitalis. Posso revisar seus sintomas, refeições e adesão diária. Como posso ajudar?' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, protocol, recentLogs }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'bot', content: data.text || data.response || 'Não consegui processar. Tente novamente.' }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'bot', content: 'Erro de conexão. Verifique sua rede e tente novamente.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerButton = inlineButton ? (
    <button
      onClick={() => setIsOpen(true)}
      className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-container to-primary-dim flex items-center justify-center glow-primary-strong hover:opacity-90 transition-all"
      title="Assistente IA"
    >
      <Sparkles size={16} className="text-white" />
    </button>
  ) : (
    <motion.button
      onClick={() => setIsOpen(true)}
      className="fixed bottom-24 right-5 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-primary-container to-primary-dim glow-primary-strong flex items-center justify-center shadow-2xl hover:scale-105 transition-transform"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Sparkles size={22} className="text-white" />
    </motion.button>
  );

  return (
    <>
      {triggerButton}

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xl"
              onClick={() => setIsOpen(false)}
            />

            {/* Chat panel */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed bottom-0 left-0 right-0 z-50 max-w-xl mx-auto"
            >
              <div className="glass-card rounded-t-3xl ghost-border border-b-0 flex flex-col" style={{ maxHeight: '75vh' }}>
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-outline-variant/30">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-container to-primary-dim flex items-center justify-center glow-primary-strong">
                      <Sparkles size={16} className="text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-on-surface">Vitalis IA</p>
                      <p className="text-[10px] uppercase tracking-widest text-secondary">Neural Link Ativo</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-full bg-surface-container-high ghost-border flex items-center justify-center hover:bg-surface-container-highest transition-colors"
                  >
                    <X size={15} className="text-on-surface-variant" />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
                    >
                      <div className={cn(
                        'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                        msg.role === 'user'
                          ? 'bg-gradient-to-br from-primary-container to-primary-dim text-white rounded-br-sm'
                          : 'glass-card ghost-border text-on-surface rounded-bl-sm'
                      )}>
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="glass-card ghost-border rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2">
                        <Loader2 size={14} className="text-secondary animate-spin" />
                        <span className="text-xs text-on-surface-variant">Analisando...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-outline-variant/30">
                  <div className="flex items-center gap-2 bg-surface-container-high rounded-2xl ghost-border px-4 py-2">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                      placeholder="Pergunte sobre seu protocolo..."
                      className="flex-1 bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-container to-primary-dim flex items-center justify-center disabled:opacity-40 transition-opacity"
                    >
                      <Send size={14} className="text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
