import { useEffect, useRef, useState } from 'react';

const NODES = [
  { id: 'cart', label: 'cart' },
  { id: 'shipping', label: 'shipping' },
  { id: 'payment', label: 'payment' },
  { id: 'processingPayment', label: 'processingPayment' },
  { id: 'confirmation', label: 'confirmation' },
];

const ERROR_NODES = [
  { id: 'paymentError', label: 'paymentError' },
  { id: 'paymentFailed', label: 'paymentFailed' },
];

function Node({ label, active, done, trouble }) {
  return (
    <div
      className={[
        'font-mono text-[11px] px-2.5 py-1.5 rounded-md border whitespace-nowrap transition-all shrink-0',
        active
          ? trouble
            ? 'border-[var(--error)] text-[var(--error)] bg-[var(--error)]/10 animate-pulse-node'
            : 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/10 animate-pulse-node'
          : done
          ? 'border-[var(--border)] text-[var(--text-muted)] bg-[var(--surface-2)]'
          : 'border-[var(--border)] text-[#4c525f] bg-transparent',
      ].join(' ')}
    >
      {label}
    </div>
  );
}

function Arrow({ lit }) {
  return (
    <span
      className={['font-mono text-xs shrink-0 transition-opacity', lit ? 'text-[var(--accent)]' : 'text-[var(--border)]'].join(
        ' '
      )}
    >
      →
    </span>
  );
}

export default function MachineVisualizer({ state, context, log }) {
  const mainOrder = NODES.map((n) => n.id);
  const mainActiveIdx = mainOrder.indexOf(state);
  const inErrorBranch = state === 'paymentError' || state === 'paymentFailed';
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = 0;
  }, [log.length]);

  const redactedPayment = {
    cardName: context.payment.cardName || '—',
    cardNumber: context.payment.cardNumber ? '•••• '.concat(context.payment.cardNumber.slice(-4)) : '—',
    expiry: context.payment.expiry || '—',
  };

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">Machine Inspector</h3>
        <span className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--success)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
          live
        </span>
      </div>

      {/* Node graph */}
      <div className="mb-5">
        <div className="flex items-center gap-1.5 flex-wrap mb-2">
          {NODES.map((n, i) => (
            <div key={n.id} className="flex items-center gap-1.5">
              <Node
                label={n.label}
                active={state === n.id}
                done={mainActiveIdx > i || (inErrorBranch && n.id === 'processingPayment')}
              />
              {i < NODES.length - 1 && <Arrow lit={mainActiveIdx > i} />}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1.5 flex-wrap pl-6 border-l border-[var(--border)] ml-2">
          <span className="font-mono text-[10px] text-[var(--text-muted)] mr-1">on error ↳</span>
          {ERROR_NODES.map((n, i) => (
            <div key={n.id} className="flex items-center gap-1.5">
              <Node label={n.label} active={state === n.id} done={false} trouble />
              {i < ERROR_NODES.length - 1 && <Arrow lit={state === 'paymentFailed'} />}
            </div>
          ))}
          {state === 'paymentError' && (
            <span className="font-mono text-[10px] text-[var(--accent)] ml-1">↺ retry loops back</span>
          )}
        </div>
      </div>

      {/* Context inspector */}
      <div className="mb-5">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-2">Context</p>
        <pre className="font-mono text-[11px] leading-relaxed bg-[var(--surface-2)] border border-[var(--border)] rounded-lg p-3 overflow-x-auto thin-scroll text-[#B8C4D9]">
{JSON.stringify(
  {
    state,
    items: context.items.length,
    total: context.items.reduce((s, i) => s + i.price * i.qty, 0),
    payment: redactedPayment,
    retryCount: `${context.retryCount}/${context.maxRetries}`,
    orderId: context.orderId,
  },
  null,
  2
)}
        </pre>
      </div>

      {/* Transition log */}
      <div className="flex-1 min-h-0 flex flex-col">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-2">Transition log</p>
        <div ref={logRef} className="flex-1 overflow-y-auto thin-scroll space-y-1 pr-1">
          {log.length === 0 && <p className="text-[11px] font-mono text-[#4c525f]">waiting for first event…</p>}
          {log.map((entry, i) => (
            <div key={entry.id} className={i === 0 ? 'animate-log-in' : ''}>
              <div className="flex items-center gap-2 text-[11px] font-mono">
                <span className="text-[#4c525f] w-16 shrink-0">{entry.time}</span>
                <span className="text-[var(--accent)] shrink-0">{entry.event}</span>
                <span className="text-[#4c525f]">·</span>
                <span className="text-[var(--text-muted)] truncate">
                  {entry.from} → {entry.to}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
