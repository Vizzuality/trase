import { createSelector } from 'reselect';

export const makeGetGroupedCharts = getCharts =>
  createSelector(
    [getCharts],
    charts => {
      if (!charts) {
        return null;
      }
      const {
        data,
        meta: { groupings }
      } = charts;
      const groupingList = Object.values(groupings);
      const groupingsByChartId = groupingList.reduce(
        (acc, grouping) => ({
          ...acc,
          ...grouping.options.reduce((acc2, option) => ({ ...acc2, [option.id]: grouping.id }), {})
        }),
        {}
      );
      const chartsData = data.map((chart, id) => ({
        ...chart,
        id,
        groupingId: typeof groupingsByChartId[id] !== 'undefined' ? groupingsByChartId[id] : null
      }));
      const singleCharts = chartsData.filter(chart => chart.groupingId === null);
      const chartsWithGrouping = chartsData.filter(chart => chart.groupingId !== null);
      const groupedCharts = chartsWithGrouping
        .reduce((acc, chart) => {
          if (!acc[chart.groupingId]) {
            acc[chart.groupingId] = {
              items: {
                [chart.id]: chart
              },
              groupingId: chart.groupingId
            };
          } else {
            acc[chart.groupingId].items[chart.id] = chart;
          }
          return acc;
        }, [])
        .filter(Boolean);
      return {
        groupings,
        charts: [...singleCharts, ...groupedCharts]
      };
    }
  );
