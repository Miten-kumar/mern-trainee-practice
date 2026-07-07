import { useEffect, useState } from "react";
import axios from "axios";

import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "../component/Tab";

interface TabItem {
  id: number;
  label: string;
  content: string;
}

const Home = () => {
  const [tabs, setTabs] = useState<TabItem[]>([]);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchTabs = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/tabs");
        setTabs(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTabs();
  }, []);

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", padding: "20px" }}>
      <h1>Flexible Tab Component System</h1>

      <h2>Controlled Tabs</h2>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <TabList>
          {tabs.map((tab, index) => (
            <Tab key={tab.id} index={index}>
              {tab.label}
            </Tab>
          ))}
        </TabList>

        <TabPanels>
          {tabs.map((tab, index) => (
            <TabPanel key={tab.id} index={index}>
              <h3>{tab.label}</h3>
              <p>{tab.content}</p>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>

      <hr />

      <h2>Uncontrolled Tabs</h2>

      <Tabs defaultIndex={0}>
        <TabList>
          {tabs.map((tab, index) => (
            <Tab key={tab.id} index={index}>
              {tab.label}
            </Tab>
          ))}
        </TabList>

        <TabPanels>
          {tabs.map((tab, index) => (
            <TabPanel key={tab.id} index={index}>
              <h3>{tab.label}</h3>
              <p>{tab.content}</p>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default Home;