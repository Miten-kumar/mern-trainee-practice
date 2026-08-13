import { useMachine } from '@xstate/react';
import { useEffect, useRef, useState } from 'react';
import { checkoutMachine } from './machine/checkoutMachine';
import { saveSnapshot, clearSnapshot } from './machine/persist';
import StepperHeader from './components/StepperHeader';
import CartStep from './components/CartStep';
import ShippingStep from './components/ShippingStep';
import PaymentStep from './components/PaymentStep';
import ProcessingStep from './components/ProcessingStep';
import PaymentErrorStep from './components/PaymentErrorStep';
import PaymentFailedStep from './components/PaymentFailedStep';
import ConfirmationStep from './components/ConfirmationStep';
import MachineVisualizer from './components/MachineVisualizer';

let logId = 0;

export default function Checkout({ sessionId, initialSnapshot, apiOnline }) {
  const [log, setLog] = useState([]);
  const [state, send, actorRef] = useMachine(checkoutMachine, { snapshot: initialSnapshot });
  const prevStateRef = useRef(state.value);

  useEffect(() => {
    saveSnapshot(sessionId, actorRef.getPersistedSnapshot());
    if (prevStateRef.current !== state.value) {
      setLog((l) =>
        [
          {
            id: ++logId,
            time: new Date().toLocaleTimeString('en-IN', { hour12: false }),
            event: state.event?.type ?? '—',
            from: String(prevStateRef.current),
            to: String(state.value),
          },
          ...l,
        ].slice(0, 30)
      );
      prevStateRef.current = state.value;
    }
  }, [state, actorRef, sessionId]);

  const value = state.value;
  const ctx = state.context;

  const renderStep = () => {
    switch (value) {
      case 'cart':
        return <CartStep context={ctx} send={send} />;
      case 'shipping':
        return <ShippingStep context={ctx} send={send} />;
      case 'payment':
        return <PaymentStep context={ctx} send={send} />;
      case 'processingPayment':
        return <ProcessingStep />;
      case 'paymentError':
        return <PaymentErrorStep context={ctx} send={send} />;
      case 'paymentFailed':
        return <PaymentFailedStep send={send} />;
      case 'confirmation':
        return <ConfirmationStep context={ctx} send={send} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-noise">
      <header className="border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[var(--accent)] flex items-center justify-center text-[#1a1305] font-display font-bold text-sm">
              N
            </div>
            <span className="font-display font-semibold tracking-tight">NODE</span>
          </div>
          <div className="flex items-center gap-4">
            <span
              className={[
                'flex items-center gap-1.5 text-[10px] font-mono',
                apiOnline ? 'text-[var(--success)]' : 'text-[var(--error)]',
              ].join(' ')}
              title={apiOnline ? 'Connected to backend' : 'Backend unreachable — running in-memory only'}
            >
              <span className={['w-1.5 h-1.5 rounded-full', apiOnline ? 'bg-[var(--success)]' : 'bg-[var(--error)]'].join(' ')} />
              {apiOnline ? 'api connected' : 'api offline'}
            </span>
            <button
              onClick={async () => {
                await clearSnapshot(sessionId);
                window.location.reload();
              }}
              className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--error)] transition-colors"
            >
              reset demo
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 md:p-8">
          <div className="mb-8">
            <StepperHeader state={value} />
          </div>
          {renderStep()}
        </div>

        <div className="lg:sticky lg:top-6">
          <MachineVisualizer state={String(value)} context={ctx} log={log} />
        </div>
      </main>

      <footer className="max-w-6xl mx-auto px-6 pb-10">
        <p className="text-[11px] font-mono text-[var(--text-muted)] text-center">
          checkout modeled as a finite state machine · cart → shipping → payment → confirmation · state persists via backend session {sessionId.slice(0, 8)}
        </p>
      </footer>
    </div>
  );
}
