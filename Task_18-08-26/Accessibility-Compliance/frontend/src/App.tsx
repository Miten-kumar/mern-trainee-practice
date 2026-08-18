import SkipLink from "./components/accessibility/SkipLink"
import AccessibleDashboard from "./components/accessibleDashboard"

const App = () => {
  return (
    <>
    {/* Allow keyboard users to skip content */}
    <SkipLink />

    <main id="main-content">
      <AccessibleDashboard/>
    </main>
    </>
  );
};

export default App;
