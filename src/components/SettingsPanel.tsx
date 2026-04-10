import { X, Bell, Clock, BellOff } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { ReminderConfig } from '../types';
import { cn } from '../lib/utils';

interface SettingsPanelProps {
  isOpen: boolean;
  reminderConfig: ReminderConfig;
  notificationPermission: NotificationPermission | 'unsupported';
  onClose: () => void;
  onRequestPermission: () => void;
  onConfigChange: (config: ReminderConfig) => void;
}

export default function SettingsPanel({
  isOpen, reminderConfig, notificationPermission, onClose, onRequestPermission, onConfigChange,
}: SettingsPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xl"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm glass-card border-l border-outline-variant/20 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-outline-variant/20">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-secondary font-semibold">VITALIS</p>
                <h2 className="font-serif text-xl font-bold text-on-surface">Configurações</h2>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-surface-container-high ghost-border flex items-center justify-center"
              >
                <X size={16} className="text-on-surface-variant" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-6">
              {/* Notifications */}
              <section>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold mb-3">Notificações</p>

                {notificationPermission !== 'granted' && (
                  <button
                    onClick={onRequestPermission}
                    disabled={notificationPermission === 'unsupported' || notificationPermission === 'denied'}
                    className={cn(
                      'w-full flex items-center gap-3 p-4 rounded-2xl border text-sm font-semibold transition-all mb-3',
                      notificationPermission === 'default'
                        ? 'border-secondary/30 bg-secondary/8 text-secondary hover:bg-secondary/12'
                        : 'border-outline-variant text-on-surface-variant/50 cursor-not-allowed'
                    )}
                  >
                    <BellOff size={16} />
                    {notificationPermission === 'default' && 'Ativar Notificações'}
                    {notificationPermission === 'denied' && 'Notificações bloqueadas'}
                    {notificationPermission === 'unsupported' && 'Não suportado'}
                  </button>
                )}

                <label className="flex items-center justify-between p-4 glass-card rounded-2xl ghost-border">
                  <div className="flex items-center gap-3">
                    <Bell size={16} className="text-primary" />
                    <span className="text-sm text-on-surface">Lembretes ativos</span>
                  </div>
                  <button
                    onClick={() => onConfigChange({ ...reminderConfig, enabled: !reminderConfig.enabled })}
                    className={cn(
                      'w-11 h-6 rounded-full transition-all duration-300 relative',
                      reminderConfig.enabled ? 'bg-secondary glow-secondary' : 'bg-surface-container-highest'
                    )}
                  >
                    <span className={cn(
                      'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300',
                      reminderConfig.enabled ? 'left-5' : 'left-0.5'
                    )} />
                  </button>
                </label>
              </section>

              {/* Times */}
              {reminderConfig.enabled && (
                <section>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold mb-3">Horários</p>
                  <div className="space-y-2">
                    {[
                      { label: 'Suplementos', field: 'supplementTime' as keyof ReminderConfig, icon: Clock },
                      { label: 'Caminhada manhã', field: 'walkMorningTime' as keyof ReminderConfig, icon: Clock },
                      { label: 'Caminhada tarde', field: 'walkAfternoonTime' as keyof ReminderConfig, icon: Clock },
                    ].map(({ label, field, icon: Icon }) => (
                      <div key={field} className="flex items-center justify-between p-3 glass-card rounded-2xl ghost-border">
                        <div className="flex items-center gap-2">
                          <Icon size={14} className="text-on-surface-variant" />
                          <span className="text-sm text-on-surface">{label}</span>
                        </div>
                        <input
                          type="time"
                          value={reminderConfig[field] as string}
                          onChange={(e) => onConfigChange({ ...reminderConfig, [field]: e.target.value })}
                          className="bg-surface-container-high text-sm text-secondary ghost-border rounded-xl px-3 py-1.5 focus:outline-none"
                        />
                      </div>
                    ))}

                    <div className="flex items-center justify-between p-3 glass-card rounded-2xl ghost-border">
                      <div className="flex items-center gap-2">
                        <Bell size={14} className="text-on-surface-variant" />
                        <span className="text-sm text-on-surface">Hidratação (min)</span>
                      </div>
                      <input
                        type="number"
                        min={15}
                        max={120}
                        value={reminderConfig.hydrationEveryMinutes}
                        onChange={(e) => onConfigChange({ ...reminderConfig, hydrationEveryMinutes: Number(e.target.value) })}
                        className="w-16 bg-surface-container-high text-sm text-secondary ghost-border rounded-xl px-3 py-1.5 text-center focus:outline-none"
                      />
                    </div>
                  </div>
                </section>
              )}

              {/* Version */}
              <div className="pt-4 border-t border-outline-variant/20 text-center">
                <p className="text-[9px] uppercase tracking-widest text-on-surface-variant/40">Vitalis Protocolo • v1.1.0</p>
                <p className="text-[9px] text-on-surface-variant/30 mt-0.5">The Celestial Laboratory</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
