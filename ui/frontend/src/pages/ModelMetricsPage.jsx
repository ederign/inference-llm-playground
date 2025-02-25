import React, { useState } from 'react';
import {
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
  Tabs,
  Tab,
  TabTitleText,
  MenuToggle,
  Menu,
  MenuContent,
  Label,
  MenuItem,
  FormGroup,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Button,
  Divider
} from '@patternfly/react-core';
import {
  ChartLine,
  ChartGroup,
  ChartVoronoiContainer,
  ChartAxis,
  ChartBar,
  ChartThemeColor,
  ChartLegend
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
import { FilterIcon, DownloadIcon, SyncAltIcon } from '@patternfly/react-icons';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';

const ModelMetricsPage = () => {
  console.log("ModelMetricsPage component rendered");
  const [activeTabKey, setActiveTabKey] = useState(0);
  const [isTimeRangeOpen, setIsTimeRangeOpen] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('Last 24 hours');
  
  // Sample data for metrics
  const timeSeriesData = {
    accuracy: [
      { x: 1, y: 92 }, { x: 2, y: 93 }, { x: 3, y: 91 }, { x: 4, y: 94 },
      { x: 5, y: 95 }, { x: 6, y: 93 }, { x: 7, y: 94 }, { x: 8, y: 96 },
      { x: 9, y: 95 }, { x: 10, y: 97 }, { x: 11, y: 96 }, { x: 12, y: 98 }
    ],
    perplexity: [
      { x: 1, y: 4.2 }, { x: 2, y: 4.0 }, { x: 3, y: 4.3 }, { x: 4, y: 3.9 },
      { x: 5, y: 3.7 }, { x: 6, y: 3.8 }, { x: 7, y: 3.6 }, { x: 8, y: 3.5 },
      { x: 9, y: 3.4 }, { x: 10, y: 3.3 }, { x: 11, y: 3.2 }, { x: 12, y: 3.1 }
    ],
    tokenGeneration: [
      { x: 1, y: 25 }, { x: 2, y: 28 }, { x: 3, y: 30 }, { x: 4, y: 32 },
      { x: 5, y: 35 }, { x: 6, y: 38 }, { x: 7, y: 40 }, { x: 8, y: 42 },
      { x: 9, y: 45 }, { x: 10, y: 48 }, { x: 11, y: 50 }, { x: 12, y: 52 }
    ]
  };
  
  // Sample data for evaluation metrics
  const evaluationMetrics = [
    { metric: 'BLEU Score', value: '0.85', change: '+0.03', status: 'improved' },
    { metric: 'ROUGE-L', value: '0.78', change: '+0.02', status: 'improved' },
    { metric: 'Perplexity', value: '3.1', change: '-0.2', status: 'improved' },
    { metric: 'Accuracy', value: '98%', change: '+2%', status: 'improved' },
    { metric: 'F1 Score', value: '0.92', change: '+0.01', status: 'improved' },
    { metric: 'Hallucination Rate', value: '2.5%', change: '-0.5%', status: 'improved' }
  ];
  
  // Sample data for recent evaluations
  const recentEvaluations = [
    { id: 1, timestamp: '2023-10-15 14:30', dataset: 'General QA', samples: 1000, accuracy: '97%', status: 'Completed' },
    { id: 2, timestamp: '2023-10-14 09:15', dataset: 'Code Generation', samples: 500, accuracy: '94%', status: 'Completed' },
    { id: 3, timestamp: '2023-10-13 16:45', dataset: 'Summarization', samples: 750, accuracy: '92%', status: 'Completed' },
    { id: 4, timestamp: '2023-10-12 11:20', dataset: 'Translation', samples: 600, accuracy: '95%', status: 'Completed' }
  ];

  const handleTabClick = (event, tabIndex) => {
    setActiveTabKey(tabIndex);
  };
  
  const timeRangeOptions = [
    'Last 24 hours',
    'Last 7 days',
    'Last 30 days',
    'Last 90 days',
    'Custom range'
  ];

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <Flex>
          <FlexItem>
            <Title headingLevel="h1" size="2xl">Model Metrics & Evaluation</Title>
            <Title headingLevel="h2" size="xl">Granite-31-1b-a400m-instruct</Title>
          </FlexItem>
          <FlexItem align={{ default: 'alignRight' }}>
            <Toolbar>
              <ToolbarContent>
                <ToolbarItem>
                  <FormGroup fieldId="timeRange">
                    <div style={{ position: 'relative' }}>
                      <MenuToggle
                        onClick={() => setIsTimeRangeOpen(!isTimeRangeOpen)}
                        isExpanded={isTimeRangeOpen}
                      >
                        {selectedTimeRange}
                      </MenuToggle>
                      {isTimeRangeOpen && (
                        <Menu
                          isOpen={true}
                          onSelect={(event, itemId) => {
                            setSelectedTimeRange(itemId);
                            setIsTimeRangeOpen(false);
                          }}
                          selected={selectedTimeRange}
                          onClose={() => setIsTimeRangeOpen(false)}
                          style={{ position: 'absolute', zIndex: 1000 }}
                        >
                          <MenuContent>
                            {timeRangeOptions.map((option, index) => (
                              <MenuItem key={index} itemId={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </MenuContent>
                        </Menu>
                      )}
                    </div>
                  </FormGroup>
                </ToolbarItem>
                <ToolbarItem>
                  <Button variant="secondary" icon={<FilterIcon />}>Filter</Button>
                </ToolbarItem>
                <ToolbarItem>
                  <Button variant="plain" icon={<SyncAltIcon />} aria-label="Refresh" />
                </ToolbarItem>
                <ToolbarItem>
                  <Button variant="plain" icon={<DownloadIcon />} aria-label="Export" />
                </ToolbarItem>
              </ToolbarContent>
            </Toolbar>
          </FlexItem>
        </Flex>
      </PageSection>
      
      <PageSection>
        <Grid hasGutter>
          {/* Performance Metrics Cards */}
          <GridItem span={4}>
            <Card>
              <CardTitle>Accuracy</CardTitle>
              <CardBody>
                <Title headingLevel="h2" size="4xl">98%</Title>
                <div style={{ color: 'green' }}>+2% from last evaluation</div>
              </CardBody>
            </Card>
          </GridItem>
          
          <GridItem span={4}>
            <Card>
              <CardTitle>Perplexity</CardTitle>
              <CardBody>
                <Title headingLevel="h2" size="4xl">3.1</Title>
                <div style={{ color: 'green' }}>-0.2 from last evaluation</div>
              </CardBody>
            </Card>
          </GridItem>
          
          <GridItem span={4}>
            <Card>
              <CardTitle>Token Generation Rate</CardTitle>
              <CardBody>
                <Title headingLevel="h2" size="4xl">52 t/s</Title>
                <div style={{ color: 'green' }}>+4 t/s from last evaluation</div>
              </CardBody>
            </Card>
          </GridItem>

          {/* Status Cards Row */}
         
          <GridItem span={4}>
            <Card>
              <CardTitle>GPU Utilization</CardTitle>
              <CardBody>
                <Title headingLevel="h2" size="4xl">78%</Title>
                <Label color="green">Optimal</Label>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem span={4}>
            <Card>
              <CardTitle>Avg. Latency</CardTitle>
              <CardBody>
                <Title headingLevel="h2" size="4xl">42ms</Title>
                <Label color="green">Good</Label>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem span={4}>
            <Card>
              <CardTitle>Requests/min</CardTitle>
              <CardBody>
                <Title headingLevel="h2" size="4xl">186</Title>
                <Label color="blue">Active</Label>
              </CardBody>
            </Card>
          </GridItem>
          
          
          {/* Metrics Charts */}
          <GridItem span={12}>
            <Card>
              <CardTitle>Performance Trends</CardTitle>
              <CardBody>
                <Tabs activeKey={activeTabKey} onSelect={handleTabClick} isBox>
                  <Tab eventKey={0} title={<TabTitleText>Accuracy</TabTitleText>}>
                    <div style={{ height: '300px', width: '100%' }}>
                      <ChartGroup
                        containerComponent={<ChartVoronoiContainer />}
                        height={300}
                        width={1200}
                        padding={{ top: 20, right: 50, bottom: 50, left: 50 }}
                      >
                        <ChartLine
                          data={timeSeriesData.accuracy}
                          style={{ data: { stroke: '#0066CC', strokeWidth: 3 } }}
                        />
                      </ChartGroup>
                      <div style={{ textAlign: 'center' }}>Time (days)</div>
                    </div>
                  </Tab>
                  <Tab eventKey={1} title={<TabTitleText>Perplexity</TabTitleText>}>
                    <div style={{ height: '300px', width: '100%' }}>
                      <ChartGroup
                        containerComponent={<ChartVoronoiContainer />}
                        height={300}
                        width={1200}
                        padding={{ top: 20, right: 50, bottom: 50, left: 50 }}
                      >
                        <ChartLine
                          data={timeSeriesData.perplexity}
                          style={{ data: { stroke: '#6EC664', strokeWidth: 3 } }}
                        />
                      </ChartGroup>
                      <div style={{ textAlign: 'center' }}>Time (days)</div>
                    </div>
                  </Tab>
                  <Tab eventKey={2} title={<TabTitleText>Token Generation</TabTitleText>}>
                    <div style={{ height: '300px', width: '100%' }}>
                      <ChartGroup
                        containerComponent={<ChartVoronoiContainer />}
                        height={300}
                        width={1200}
                        padding={{ top: 20, right: 50, bottom: 50, left: 50 }}
                      >
                        <ChartLine
                          data={timeSeriesData.tokenGeneration}
                          style={{ data: { stroke: '#F0AB00', strokeWidth: 3 } }}
                        />
                      </ChartGroup>
                      <div style={{ textAlign: 'center' }}>Time (days)</div>
                    </div>
                  </Tab>
                </Tabs>
              </CardBody>
            </Card>
          </GridItem>
          
          {/* Evaluation Metrics Table */}
          <GridItem span={6}>
            <Card>
              <CardTitle>Evaluation Metrics</CardTitle>
              <CardBody>
                <Table aria-label="Evaluation metrics table" variant="compact">
                  <Thead>
                    <Tr>
                      <Th>Metric</Th>
                      <Th>Value</Th>
                      <Th>Change</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {evaluationMetrics.map((metric, index) => (
                      <Tr key={index}>
                        <Td>{metric.metric}</Td>
                        <Td>{metric.value}</Td>
                        <Td style={{ color: metric.status === 'improved' ? 'green' : 'red' }}>
                          {metric.change}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </CardBody>
            </Card>
          </GridItem>
          
          {/* Recent Evaluations Table */}
          <GridItem span={6}>
            <Card>
              <CardTitle>Recent Evaluations</CardTitle>
              <CardBody>
                <Table aria-label="Recent evaluations table" variant="compact">
                  <Thead>
                    <Tr>
                      <Th>Date</Th>
                      <Th>Dataset</Th>
                      <Th>Samples</Th>
                      <Th>Accuracy</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {recentEvaluations.map((evaluation, index) => (
                      <Tr key={index}>
                        <Td>{evaluation.timestamp}</Td>
                        <Td>{evaluation.dataset}</Td>
                        <Td>{evaluation.samples}</Td>
                        <Td>{evaluation.accuracy}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </PageSection>
    </>
  );
};

export default ModelMetricsPage; 