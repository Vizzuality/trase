const yearAxis = {
  type: 'category',
  label: 'Year'
};

const tradeVolumeAxis = {
  type: 'number',
  label: 'Trade volume',
  suffix: 't'
};

export const meta = {
  sYear: {
    yAxis: { ...tradeVolumeAxis, label: 'BIOME' },
    xAxis: yearAxis,
    y: {
      label: 'BIOME'
    },
    x0: {
      label: 'Trade volume'
    },
    info: {
      node_type: 'BIOME',
      years: {
        start_year: 2017,
        end_year: null
      },
      top_n: 10,
      filter: {
        cont_attribute: 'Trade volume',
        ncont_attribute: null
      }
    }
  },
  mYearNCont: {
    xAxis: yearAxis,
    yAxis: tradeVolumeAxis,
    x: {
      label: 'Year'
    },
    info: {
      node_type: null,
      years: {
        start_year: 2015,
        end_year: 2017
      },
      top_n: null,
      filter: {
        cont_attribute: 'Trade volume',
        ncont_attribute: 'Zero Deforestation Commitment (Exporter)'
      }
    },
    y0: {
      label: 'Company commitment'
    },
    y1: {
      label: 'None'
    },
    y2: {
      label: 'Soy Moratorium'
    }
  }
};

export const data = [
  {
    y0: 10457513.0746646,
    y1: 11861749.8739572,
    x: 2015
  },
  {
    y0: 11109630.731909,
    y1: 8458339.19252643,
    x: 2016
  },
  {
    y0: 15085004.7884278,
    y1: 9899442.33597331,
    x: 2017
  }
];
