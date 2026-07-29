import { AppError } from '../errors';

const API_URL = 'http://localhost:4000';

export interface ErrorLogContext {
  componentStack?: string;
  level?: 'root' | 'page' | 'section';
}

// kept in memory only, resets on page refresh - good enough for a
// small "errors this session" panel, not meant to replace a real
// analytics tool
const sessionStats: Record<string, number> = {};

type Listener = () => void;
const listeners: Listener[] = [];

function notifyListeners() {
  listeners.forEach((l) => l());
}

export function subscribeToStats(listener: Listener) {
  listeners.push(listener);
  return () => {
    const i = listeners.indexOf(listener);
    if (i > -1) listeners.splice(i, 1);
  };
}

export function getStats() {
  return { ...sessionStats };
}

class ErrorLoggerService {
  logError(error: Error, context: ErrorLogContext = {}) {
    const type = error instanceof AppError ? error.type : 'runtime';

    // always log to console too, so it shows up while developing
    console.error(`[${type}]`, error, context);

    sessionStats[type] = (sessionStats[type] || 0) + 1;
    notifyListeners();

    const payload = {
      message: error.message,
      type,
      stack: error.stack,
      componentStack: context.componentStack,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    };

    // fire and forget - if logging itself fails, just log that to
    // the console, we don't want error logging to cause more errors
    fetch(`${API_URL}/api/errors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch((err) => {
      console.warn('Could not send error log to server', err);
    });
  }
}

export const errorLogger = new ErrorLoggerService();
