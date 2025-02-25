import React, { useState } from 'react';
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
  NavItem
} from '@patternfly/react-core';
import {
  ChartDonut,
  ChartThemeColor
} from '@patternfly/react-charts';
import {
  CubesIcon,
  ServerIcon,
  StorageDomainIcon,
  UsersIcon,
  BellIcon,
  CogIcon, 
  MonitoringIcon,
  ServerGroupIcon
} from '@patternfly/react-icons';
import EmbeddedChatbot from './components/EmbeddedChatbot';
import './App.css';

function App() {
  const [isNavOpen, setIsNavOpen] = useState(true);
  
  // Sample data for charts
  const donutData = [
    { x: 'Used', y: 60 },
    { x: 'Available', y: 40 }
  ];

  const onNavToggle = () => {
    setIsNavOpen(!isNavOpen);
  };

  const Navigation = (
    <Nav>
      <NavList>
        <NavItem itemId={0} isActive icon={<MonitoringIcon />}>
          Dashboard
        </NavItem>
        <NavItem itemId={1} icon={<MonitoringIcon />}>
          Monitoring
        </NavItem>
        <NavItem itemId={2} icon={<ServerGroupIcon />}>
          Infrastructure
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
      header={<div className="pf-v5-c-page__header-brand">System Dashboard</div>}
      sidebar={Sidebar}
      isManagedSidebar
      onPageResize={onNavToggle}
    >
      <PageSection variant={PageSectionVariants.light}>
        <Flex>
          <FlexItem>
            <Title headingLevel="h1" size="2xl">System Dashboard</Title>
            <Title headingLevel="h1" size="xl">  Overview of your system's performance and resources </Title>
          </FlexItem>
          <FlexItem align={{ default: 'alignRight' }}>
            <Flex>
              <FlexItem>
                <Button variant="secondary" icon={<BellIcon />}>Notifications</Button>
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
          {/* Status Cards Row */}
          <GridItem span={3}>
            <Card>
              <CardBody>
                <Flex>
                  <FlexItem>
                    <ServerIcon size="lg" />
                  </FlexItem>
                  <FlexItem>
                    <Title headingLevel="h4" size="md">Servers</Title>
                    <Title headingLevel="h2" size="3xl">12</Title>
                    <Label color="green">Healthy</Label>
                  </FlexItem>
                </Flex>
              </CardBody>
            </Card>
          </GridItem>
          
          <GridItem span={3}>
            <Card>
              <CardBody>
                <Flex>
                  <FlexItem>
                    <CubesIcon size="lg" />
                  </FlexItem>
                  <FlexItem>
                    <Title headingLevel="h4" size="md">Containers</Title>
                    <Title headingLevel="h2" size="3xl">48</Title>
                    <Label color="blue">Running</Label>
                  </FlexItem>
                </Flex>
              </CardBody>
            </Card>
          </GridItem>
          
          <GridItem span={3}>
            <Card>
              <CardBody>
                <Flex>
                  <FlexItem>
                    <StorageDomainIcon size="lg" />
                  </FlexItem>
                  <FlexItem>
                    <Title headingLevel="h4" size="md">Storage</Title>
                    <Title headingLevel="h2" size="3xl">4 TB</Title>
                    <Label color="orange">Warning</Label>
                  </FlexItem>
                </Flex>
              </CardBody>
            </Card>
          </GridItem>
          
          <GridItem span={3}>
            <Card>
              <CardBody>
                <Flex>
                  <FlexItem>
                    <UsersIcon size="lg" />
                  </FlexItem>
                  <FlexItem>
                    <Title headingLevel="h4" size="md">Users</Title>
                    <Title headingLevel="h2" size="3xl">25</Title>
                    <Label color="green">Active</Label>
                  </FlexItem>
                </Flex>
              </CardBody>
            </Card>
          </GridItem>
          
          {/* Chatbot Row - Replacing Weekly Performance */}
          <GridItem span={12}>
            <Card className="chatbot-container">
              <CardTitle>System Assistant</CardTitle>
              <CardBody>
                <EmbeddedChatbot />
              </CardBody>
            </Card>
          </GridItem>
          
         
          
          {/* Resource Utilization Row */}
          <GridItem span={12}>
            <Card>
              <CardTitle>Resource Utilization</CardTitle>
              <CardBody>
                <Grid hasGutter>
                  <GridItem span={4}>
                    <Title headingLevel="h4" size="md">CPU Usage</Title>
                    <Progress
                      value={68}
                      title="68%"
                      size={ProgressSize.lg}
                      measureLocation={ProgressMeasureLocation.outside}
                    />
                  </GridItem>
                  <GridItem span={4}>
                    <Title headingLevel="h4" size="md">Memory Usage</Title>
                    <Progress
                      value={42}
                      title="42%"
                      size={ProgressSize.lg}
                      measureLocation={ProgressMeasureLocation.outside}
                    />
                  </GridItem>
                  <GridItem span={4}>
                    <Title headingLevel="h4" size="md">Network Throughput</Title>
                    <Progress
                      value={87}
                      title="87%"
                      size={ProgressSize.lg}
                      measureLocation={ProgressMeasureLocation.outside}
                    />
                  </GridItem>
                </Grid>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </PageSection>
    </Page>
  );
}

export default App;

