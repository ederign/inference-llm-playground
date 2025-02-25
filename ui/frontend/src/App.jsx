import React, { useState, useEffect } from 'react';
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
  TabTitleText
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

function App() {
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [activeTabKey, setActiveTabKey] = useState(0);
  
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

  const Navigation = (
    <Nav>
      <NavList>
        <NavItem itemId={0} isActive icon={<MonitoringIcon />}>
          Dashboard
        </NavItem>
        <NavItem itemId={1} icon={<MonitoringIcon />}>
          Model Metrics
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
      header={<div className="pf-v5-c-page__header-brand">KServe Model Dashboard</div>}
      sidebar={Sidebar}
      isManagedSidebar
      onPageResize={onNavToggle}
    >
      <PageSection variant={PageSectionVariants.light}>
        <Flex>
          <FlexItem>
            <Title headingLevel="h1" size="2xl">Granite-31-1b-a400m-instruct</Title>
            <Title headingLevel="h1" size="xl">LLM Model Serving Performance & Resources</Title>
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
          {/* Status Cards Row */}
          <GridItem span={3}>
            <Card>
              <CardBody>
                <Flex>
                  <FlexItem>
                    <CpuIcon size="lg" />
                  </FlexItem>
                  <FlexItem>
                    <Title headingLevel="h4" size="md">GPU Utilization</Title>
                    <Title headingLevel="h2" size="3xl">78%</Title>
                    <Label color="green">Optimal</Label>
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
                    <ClockIcon size="lg" />
                  </FlexItem>
                  <FlexItem>
                    <Title headingLevel="h4" size="md">Avg. Latency</Title>
                    <Title headingLevel="h2" size="3xl">42ms</Title>
                    <Label color="green">Good</Label>
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
                    <Title headingLevel="h4" size="md">Requests/min</Title>
                    <Title headingLevel="h2" size="3xl">186</Title>
                    <Label color="blue">Active</Label>
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
                    <MemoryIcon size="lg" />
                  </FlexItem>
                  <FlexItem>
                    <Title headingLevel="h4" size="md">VRAM Usage</Title>
                    <Title headingLevel="h2" size="3xl">32GB</Title>
                    <Label color="orange">High</Label>
                  </FlexItem>
                </Flex>
              </CardBody>
            </Card>
          </GridItem>
          
          {/* Model Performance Charts */}
          <GridItem span={6}>
            <Card>
              <CardTitle>Inference Performance</CardTitle>
              <CardBody>
                <Tabs activeKey={activeTabKey} onSelect={handleTabClick} isBox>
                  <Tab eventKey={0} title={<TabTitleText>Latency</TabTitleText>}>
                    <div style={{ height: '250px', width: '100%' }}>
                      <ChartGroup
                        containerComponent={<ChartVoronoiContainer />}
                        height={250}
                        width={500}
                        padding={{ top: 20, right: 20, bottom: 50, left: 50 }}
                      >
                        <ChartLine
                          data={timeSeriesData.latency}
                          style={{ data: { stroke: '#0066CC', strokeWidth: 3 } }}
                        />
                      </ChartGroup>
                      <div style={{ textAlign: 'center' }}>Time (minutes)</div>
                    </div>
                  </Tab>
                  <Tab eventKey={1} title={<TabTitleText>Throughput</TabTitleText>}>
                    <div style={{ height: '250px', width: '100%' }}>
                      <ChartGroup
                        containerComponent={<ChartVoronoiContainer />}
                        height={250}
                        width={500}
                        padding={{ top: 20, right: 20, bottom: 50, left: 50 }}
                      >
                        <ChartLine
                          data={timeSeriesData.throughput}
                          style={{ data: { stroke: '#6EC664', strokeWidth: 3 } }}
                        />
                      </ChartGroup>
                      <div style={{ textAlign: 'center' }}>Time (minutes)</div>
                    </div>
                  </Tab>
                </Tabs>
              </CardBody>
            </Card>
          </GridItem>
          
          <GridItem span={6}>
            <Card>
              <CardTitle>GPU Utilization Over Time</CardTitle>
              <CardBody>
                <div style={{ height: '250px', width: '100%' }}>
                  <ChartGroup
                    containerComponent={<ChartVoronoiContainer />}
                    height={250}
                    width={500}
                    padding={{ top: 20, right: 20, bottom: 50, left: 50 }}
                  >
                    <ChartLine
                      data={timeSeriesData.gpuUtilization}
                      style={{ data: { stroke: '#F0AB00', strokeWidth: 3 } }}
                    />
                  </ChartGroup>
                  <div style={{ textAlign: 'center' }}>Time (minutes)</div>
                </div>
              </CardBody>
            </Card>
          </GridItem>
          
          {/* Resource Utilization Row */}
          <GridItem span={6}>
            <Card>
              <CardTitle>Resource Utilization</CardTitle>
              <CardBody>
                <Grid hasGutter>
                  <GridItem span={12}>
                    <Title headingLevel="h4" size="md">GPU Memory</Title>
                    <Progress
                      value={88}
                      title="88%"
                      size={ProgressSize.lg}
                      measureLocation={ProgressMeasureLocation.outside}
                    />
                  </GridItem>
                  <GridItem span={12}>
                    <Title headingLevel="h4" size="md">CPU Usage</Title>
                    <Progress
                      value={42}
                      title="42%"
                      size={ProgressSize.lg}
                      measureLocation={ProgressMeasureLocation.outside}
                    />
                  </GridItem>
                  <GridItem span={12}>
                    <Title headingLevel="h4" size="md">Network Bandwidth</Title>
                    <Progress
                      value={65}
                      title="65%"
                      size={ProgressSize.lg}
                      measureLocation={ProgressMeasureLocation.outside}
                    />
                  </GridItem>
                </Grid>
              </CardBody>
            </Card>
          </GridItem>
          
          <GridItem span={6}>
            <Card>
              <CardTitle>Model Serving Statistics</CardTitle>
              <CardBody>
                <Grid hasGutter>
                  <GridItem span={6}>
                    <Card isPlain>
                      <CardTitle>Token Generation</CardTitle>
                      <CardBody>
                        <div style={{ height: '180px' }}>
                          <ChartDonut
                            ariaDesc="Token generation stats"
                            ariaTitle="Token generation donut chart"
                            constrainToVisibleArea
                            data={[
                              { x: 'Prompt', y: 30 },
                              { x: 'Generation', y: 70 }
                            ]}
                            labels={({ datum }) => `${datum.x}: ${datum.y}%`}
                            legendData={[
                              { name: 'Prompt: 30%' },
                              { name: 'Generation: 70%' }
                            ]}
                            legendOrientation="vertical"
                            legendPosition="right"
                            padding={{
                              bottom: 20,
                              left: 20,
                              right: 140,
                              top: 20
                            }}
                            themeColor={ChartThemeColor.blue}
                            width={350}
                          />
                        </div>
                      </CardBody>
                    </Card>
                  </GridItem>
                  <GridItem span={6}>
                    <Card isPlain>
                      <CardTitle>Request Status</CardTitle>
                      <CardBody>
                        <div style={{ height: '180px' }}>
                          <ChartDonut
                            ariaDesc="Request status stats"
                            ariaTitle="Request status donut chart"
                            constrainToVisibleArea
                            data={[
                              { x: 'Success', y: 95 },
                              { x: 'Failed', y: 3 },
                              { x: 'Timeout', y: 2 }
                            ]}
                            labels={({ datum }) => `${datum.x}: ${datum.y}%`}
                            legendData={[
                              { name: 'Success: 95%' },
                              { name: 'Failed: 3%' },
                              { name: 'Timeout: 2%' }
                            ]}
                            legendOrientation="vertical"
                            legendPosition="right"
                            padding={{
                              bottom: 20,
                              left: 20,
                              right: 140,
                              top: 20
                            }}
                            themeColor={ChartThemeColor.green}
                            width={350}
                          />
                        </div>
                      </CardBody>
                    </Card>
                  </GridItem>
                </Grid>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem span={12}>
            <Card className="chatbot-container">
              <CardTitle>System Assistant</CardTitle>
              <CardBody>
                <EmbeddedChatbot />
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </PageSection>
    </Page>
  );
}

export default App;

