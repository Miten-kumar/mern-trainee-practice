import { ErrorBoundary } from './components/ErrorBoundary';
import { RootFallback, PageFallback } from './components/FallbackUI';
import { Dashboard } from './components/Dashboard';

// 3 levels of boundary in this app:
// root    - catches anything that slips past everything else, full page fallback
// page    - catches errors from an entire page/route, page level fallback
// section - catches errors from a single widget, small inline fallback (see Dashboard.tsx)
export default function App() {
  return (
    <ErrorBoundary level="root" fallback={RootFallback}>
      <div className="app-shell">
        <ErrorBoundary level="page" fallback={PageFallback}>
          <Dashboard />
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
}
