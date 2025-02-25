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
  ChartBar,
  ChartDonut,
  ChartThemeColor,
  ChartGroup,
  ChartLine
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
import './App.css';

function App() {
  const [isNavOpen, setIsNavOpen] = useState(true);
  
  // Sample data for charts
  const donutData = [
    { x: 'Used', y: 60 },
    { x: 'Available', y: 40 }
  ];

  const barChartData = [
    { name: 'Mon', x: 1, y: 3 },
    { name: 'Tue', x: 2, y: 5 },
    { name: 'Wed', x: 3, y: 8 },
    { name: 'Thu', x: 4, y: 9 },
    { name: 'Fri', x: 5, y: 7 },
    { name: 'Sat', x: 6, y: 5 },
    { name: 'Sun', x: 7, y: 4 }
  ];

  const lineChartData = [
    { name: 'CPU', x: 1, y: 3 },
    { name: 'CPU', x: 2, y: 4 },
    { name: 'CPU', x: 3, y: 3 },
    { name: 'CPU', x: 4, y: 5 },
    { name: 'CPU', x: 5, y: 6 },
    { name: 'CPU', x: 6, y: 4 },
    { name: 'CPU', x: 7, y: 7 }
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
          
          {/* Charts Row */}
          <GridItem span={8}>
            <Card className="dashboard-chart-container">
              <CardTitle>Weekly Performance</CardTitle>
              <CardBody>
                <div style={{ height: '250px' }}>
                  <ChartGroup
                    ariaDesc="Weekly performance metrics"
                    ariaTitle="Weekly performance chart"
                    containerComponent={
                      <div style={{ height: '225px', width: '100%' }} />
                    }
                    height={225}
                    padding={{
                      bottom: 50,
                      left: 50,
                      right: 50,
                      top: 20
                    }}
                    width={800}
                  >
                    <ChartBar data={barChartData} />
                    <ChartLine data={lineChartData} />
                  </ChartGroup>
                </div>
              </CardBody>
            </Card>
          </GridItem>
          
          <GridItem span={4}>
            <Card>
              <CardTitle>Storage Utilization</CardTitle>
              <CardBody>
                <Bullseye>
                  <div style={{ height: '230px', width: '230px' }}>
                    <ChartDonut
                      ariaDesc="Storage usage"
                      ariaTitle="Storage donut chart"
                      constrainToVisibleArea
                      data={donutData}
                      labels={({ datum }) => `${datum.x}: ${datum.y}%`}
                      legendData={[
                        { name: 'Used: 60%' },
                        { name: 'Available: 40%' }
                      ]}
                      legendOrientation="vertical"
                      legendPosition="right"
                      padding={{
                        bottom: 20,
                        left: 20,
                        right: 140,
                        top: 20
                      }}
                      subTitle="of 4 TB"
                      title="60%"
                      themeColor={ChartThemeColor.blue}
                      width={350}
                    />
                  </div>
                </Bullseye>
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

