import { ErrorBoundary } from './ErrorBoundary';
import { SectionFallback } from './FallbackUI';
import { ProfileWidget } from './ProfileWidget';
import { StatsWidget } from './StatsWidget';
import { BuggyWidget } from './BuggyWidget';
import { ErrorAnalyticsPanel } from './ErrorAnalyticsPanel';

// each widget gets its own boundary, so if the buggy widget crashes
// it doesn't take the profile/stats widgets down with it
export function Dashboard() {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <div className="widget-grid">
        <ErrorBoundary level="section" fallback={SectionFallback}>
          <ProfileWidget />
        </ErrorBoundary>

        <ErrorBoundary level="section" fallback={SectionFallback}>
          <StatsWidget />
        </ErrorBoundary>

        <ErrorBoundary level="section" fallback={SectionFallback}>
          <BuggyWidget />
        </ErrorBoundary>
      </div>

      <ErrorAnalyticsPanel />
    </div>
  );
}
