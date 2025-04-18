import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  Page,
  PageSection,
  PageSectionVariants,
  Title, 
  Card,
  CardTitle,
  CardBody,
  Grid,
  GridItem,
  Flex,
  FlexItem,
  Button,
  Bullseye,
  Label,
  Progress,
  ProgressSize,
  ProgressMeasureLocation,
  PageSidebar,
  PageSidebarBody,
  Nav,
  NavList,
  NavItem,
  Tabs,
  Tab,
  TabTitleText,
  Alert,
  AlertActionCloseButton
} from '@patternfly/react-core';
import {
  ChartDonut,
  ChartThemeColor,
  ChartLine,
  ChartGroup,
  ChartVoronoiContainer,
  ChartAxis
} from '@patternfly/react-charts';
import {
  CubesIcon,
  ServerIcon,
  StorageDomainIcon,
  UsersIcon,
  BellIcon,
  CogIcon, 
  MonitoringIcon,
  ServerGroupIcon,
  MemoryIcon,
  CpuIcon,
  NetworkIcon,
  ClockIcon
} from '@patternfly/react-icons';
import EmbeddedChatbot from './components/EmbeddedChatbot';
import './App.css';
import ModelMetricsPage from './pages/ModelMetricsPage';

function AppContent() {
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [activeTabKey, setActiveTabKey] = useState(0);
  const [showAlert, setShowAlert] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Sample data for charts
  const donutData = [
    { x: 'Used', y: 60 },
    { x: 'Available', y: 40 }
  ];

  // Sample time series data for inference metrics
  const timeSeriesData = {
    latency: [
      { x: 1, y: 45 }, { x: 2, y: 55 }, { x: 3, y: 35 }, { x: 4, y: 40 },
      { x: 5, y: 50 }, { x: 6, y: 45 }, { x: 7, y: 35 }, { x: 8, y: 30 },
      { x: 9, y: 40 }, { x: 10, y: 42 }, { x: 11, y: 38 }, { x: 12, y: 35 }
    ],
    throughput: [
      { x: 1, y: 120 }, { x: 2, y: 140 }, { x: 3, y: 180 }, { x: 4, y: 160 },
      { x: 5, y: 150 }, { x: 6, y: 170 }, { x: 7, y: 190 }, { x: 8, y: 200 },
      { x: 9, y: 180 }, { x: 10, y: 190 }, { x: 11, y: 210 }, { x: 12, y: 200 }
    ],
    gpuUtilization: [
      { x: 1, y: 65 }, { x: 2, y: 75 }, { x: 3, y: 85 }, { x: 4, y: 70 },
      { x: 5, y: 65 }, { x: 6, y: 80 }, { x: 7, y: 90 }, { x: 8, y: 75 },
      { x: 9, y: 70 }, { x: 10, y: 85 }, { x: 11, y: 80 }, { x: 12, y: 75 }
    ]
  };

  const onNavToggle = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleTabClick = (event, tabIndex) => {
    setActiveTabKey(tabIndex);
  };

  const handleNavSelect = (result) => {
    console.log("Navigation selected:", result);
    
    // Extract the itemId from the result object
    let navItemId;
    if (typeof result === 'object' && result !== null) {
      if (result.itemId && typeof result.itemId === 'object') {
        navItemId = result.itemId.itemId; // Handle nested object case
      } else if (result.itemId) {
        navItemId = result.itemId; // Handle direct itemId property
      }
    }
    
    console.log("Navigating to:", navItemId);
    
    if (navItemId === 'dashboard') {
      console.log("Navigating to dashboard");
      navigate('/');
    } else if (navItemId === 'model-metrics') {
      console.log("Navigating to model metrics");
      navigate('/model-metrics');
    }
  };

  const Navigation = (
    <Nav onSelect={(event, itemObj) => {
      console.log("Nav selected with itemId:", itemObj);
      // Pass the itemObj directly to handleNavSelect
      handleNavSelect({ itemId: itemObj });
    }}>
      <NavList>
        <NavItem 
          itemId="dashboard" 
          isActive={location.pathname === '/'} 
          icon={<ServerGroupIcon />}
        >
          Dashboard
        </NavItem>
        <NavItem 
          itemId="model-metrics" 
          isActive={location.pathname === '/model-metrics'} 
          icon={<MonitoringIcon />}
        >
          Model Metrics
        </NavItem>  
      </NavList>
    </Nav>
  );

  const Sidebar = (
    <PageSidebar isSidebarOpen={isNavOpen}>
      <PageSidebarBody>
        {Navigation}
      </PageSidebarBody>
    </PageSidebar>
  );

  return (
    <Page 
      header={<div className="pf-v5-c-page__header-brand">KServe Model Dashboard</div>}
      sidebar={Sidebar}
      isManagedSidebar
      onPageResize={onNavToggle}
    >
      {console.log("Current location:", location.pathname)}
      <Routes>
        <Route path="/" element={
          <>
            {console.log("Rendering Dashboard")}
            <DashboardContent 
              showAlert={showAlert} 
              setShowAlert={setShowAlert} 
              activeTabKey={activeTabKey} 
              handleTabClick={handleTabClick}
              timeSeriesData={timeSeriesData}
            />
          </>
        } />
        <Route path="/model-metrics" element={
          <>
            {console.log("Rendering Model Metrics")}
            <ModelMetricsPage />
          </>
        } />
      </Routes>
    </Page>
  );
}

// Extract Dashboard content to a separate component
function DashboardContent({ showAlert, setShowAlert, activeTabKey, handleTabClick, timeSeriesData }) {
  showAlert = false;
  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        {showAlert && (
          <Alert
            variant="warning"
            title="Important Note"
            actionClose={<AlertActionCloseButton onClose={() => setShowAlert(false)} />}
            style={{ marginBottom: '16px' }}
          > 
          <p>
            This is a POC of a <strong>UI companion</strong> of a Model. It is hosted in the KServe Inference Service (in this case, a LLM model).
          </p>
          <p>
           Each model type could potentially have a it&apos;s own dashboard hosted in the Inference Service (in companion with the model), with a different set of metrics and charts.
          </p>
            <p>
              Note that, the metrics charts displayed for this demo are currently hardcoded for demonstration purposes. 
            </p>
            <p>
            In a real solution, these could probably be based on real-time LLM observability data.
            </p>
            <p>
              <strong>The chatbot is live</strong> and connected to the Inference Service model. Your interactions will be processed by the actual model.
            </p>
          </Alert>
        )}
        
        <Flex>
          <FlexItem>
            <Title headingLevel="h1" size="2xl">LLama Stack Chat Bot UI</Title> 
          </FlexItem>
          <FlexItem align={{ default: 'alignRight' }}>
            <Flex>
              <FlexItem>
                <Button variant="secondary" icon={<BellIcon />}>Alerts</Button>
              </FlexItem>
              <FlexItem>
                <Button variant="plain" icon={<CogIcon />} aria-label="Settings" />
              </FlexItem>
            </Flex>
          </FlexItem>
        </Flex>
      </PageSection>
      
      <PageSection>
        <Grid hasGutter>
          <GridItem span={12}>
            <Card className="chatbot-container">
              <CardTitle>Chat with your model</CardTitle>
              <CardBody>
                <EmbeddedChatbot />
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </PageSection>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

