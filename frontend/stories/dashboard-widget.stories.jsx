import React from 'react';
import { storiesOf } from '@storybook/react';

import DashboardWidget from 'react-components/dashboard-element/dashboard-widget/dashboard-widget.component';
import data from './mock-data/dashboard-widget-data';
import dataPie from './mock-data/dashboard-widget-data-pie';
// import horizontalData from './mock-data/dashboard-widget-horizontal-data';
// import horizontalMultipleData from './mock-data/dashboard-widget-horizontal-multiple-data';
// import dynamicSentenceData from './mock-data/dashboard-widget-dynamic-sentence-data';
// import rankingData from './mock-data/dashboard-widget-ranking-data';
// import dynamicSentenceParts from './mock-data/dashboard-widget-dynamic-sentence-parts';
import config, { meta } from './mock-data/dashboard-widget-config-mock';

storiesOf('DashboardWidget', module)
  .addParameters({ component: DashboardWidget })
  .addWithJSX('Line', () => (
    <div className="chart-container">
      <DashboardWidget title="Line Chart" data={data} meta={meta} chartConfig={config.line} />
    </div>
  ));

storiesOf('DashboardWidget', module)
  .addParameters({ component: DashboardWidget })
  .addWithJSX('Bar', () => (
    <div className="chart-container">
      <DashboardWidget title="Bar Chart" data={data} meta={meta} chartConfig={config.bar} />
    </div>
  ));

storiesOf('DashboardWidget', module)
  .addParameters({ component: DashboardWidget })
  .addWithJSX('Stacked bar', () => (
    <div className="chart-container">
      <DashboardWidget
        title="Stacked bar Chart"
        data={data}
        meta={meta}
        chartConfig={config.stackedBar}
      />
    </div>
  ));

// storiesOf('DashboardWidget', module)
//   .addParameters({ component: DashboardWidget })
//   .addWithJSX('Horizontal bar', () => (
//     <div className="chart-container">
//       <DashboardWidget
//         title="Horizontal bar Chart"
//         data={horizontalData}
//         meta={meta}
//         chartConfig={config.horizontalBar}
//       />
//     </div >
//   ));

// storiesOf('DashboardWidget', module)
//   .addParameters({ component: DashboardWidget })
//   .addWithJSX('Horizontal stacked bar', () => (
//     <div className="chart-container">
//       <DashboardWidget
//         title="Horizontal stacked bar Chart"
//         data={horizontalMultipleData}
//         meta={meta}
//         chartConfig={config.horizontalStackedBar}
//       />
//     </div >
//   ));

storiesOf('DashboardWidget', module)
  .addParameters({ component: DashboardWidget })
  .addWithJSX('Pie', () => (
    <div className="chart-container">
      <DashboardWidget title="Pie Chart" data={dataPie} meta={meta} chartConfig={config.pie} />
    </div>
  ));

storiesOf('DashboardWidget', module)
  .addParameters({ component: DashboardWidget })
  .addWithJSX('Loading', () => (
    <div className="chart-container">
      <DashboardWidget loading title="Loading chart" />
    </div>
  ));

storiesOf('DashboardWidget', module)
  .addParameters({ component: DashboardWidget })
  .addWithJSX('Error', () => (
    <div className="chart-container">
      <DashboardWidget error={{ statusText: 'Something wrong happened' }} title="Error chart" />
    </div>
  ));

//  TODO: We are missing a provider or pass the store through a context for this two widgets */}
//    <DashboardWidget
//     title="Dynamic sentence"
//     data={dynamicSentenceData}
//     meta={meta}
//     dynamicSentenceParts={dynamicSentenceParts}
//     chartConfig={config.dynamicSentence}
//   />
//   <DashboardWidget
//     title="Ranking"
//     data={rankingData}
//     meta={meta}
//     chartConfig={config.ranking}
//   />
