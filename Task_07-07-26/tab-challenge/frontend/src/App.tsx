import { useState } from "react";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "./components/Tabs";
import { LazyProof } from "./components/LazyProof";
// import "./App.css";

export default function App() {
  return (
    <div className="app">
      <h1>Tab Component Demo</h1>

      <section>
        <h2>Uncontrolled (Tabs manages its own state)</h2>
        <Tabs defaultIndex={0}>
          <TabList>
            <Tab>Profile</Tab>
            <Tab>Settings</Tab>
            <Tab>Billing</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <LazyProof label="Profile" />
            </TabPanel>
            <TabPanel>
              <LazyProof label="Settings" />
            </TabPanel>
            <TabPanel>
              <LazyProof label="Billing" />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </section>

      <section>
        <h2>Controlled (parent owns the active index)</h2>
        <ControlledExample />
      </section>
    </div>
  );
}

function ControlledExample() {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <>
      <div className="external-controls">
        <button onClick={() => setActiveTab(0)}>Jump to Overview</button>
        <button onClick={() => setActiveTab(2)}>Jump to Reports</button>
      </div>

      <Tabs index={activeTab} onChange={setActiveTab}>
        <TabList>
          <Tab>Overview</Tab>
          <Tab>Activity</Tab>
          <Tab>Reports</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <LazyProof label="Overview" />
          </TabPanel>
          <TabPanel keepMounted={false}>
            <p>
              This panel has <code>keepMounted={"{false}"}</code>, so it
              actually unmounts every time you leave it (check React
              DevTools - it disappears from the tree, not just hidden).
            </p>
          </TabPanel>
          <TabPanel>
            <LazyProof label="Reports" />
          </TabPanel>
        </TabPanels>
      </Tabs>

      <p className="hint">
        Current tab index from parent state: <strong>{activeTab}</strong>
      </p>
    </>
  );
}
