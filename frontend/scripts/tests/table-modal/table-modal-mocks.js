const yAxis = {
  type: 'category',
  label: 'Year',
  prefix: '',
  format: '',
  suffix: ''
};

const xAxis = {
  type: 'number',
  label: 'Trade volume',
  prefix: '',
  format: '',
  suffix: 't'
};

export const meta = {
  sYear: {
    yAxis: { ...yAxis, label: 'BIOME' },
    xAxis,
    y: {
      label: 'BIOME',
      tooltip: {
        prefix: '',
        format: '',
        suffix: ''
      }
    },
    x0: {
      label: 'Trade volume',
      tooltip: {
        prefix: '',
        format: '',
        suffix: 't'
      }
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
    xAxis: { ...xAxis, label: 'Year', type: 'category' },
    yAxis: { ...yAxis, label: 'Trade volume', type: 'number' },
    x: {
      label: 'Year',
      tooltip: {
        prefix: '',
        format: '',
        suffix: ''
      }
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
      label: 'Company commitment',
      tooltip: {
        prefix: '',
        format: '',
        suffix: ''
      }
    },
    y1: {
      label: 'None',
      tooltip: {
        prefix: '',
        format: '',
        suffix: ''
      }
    },
    y2: {
      label: 'Soy Moratorium',
      tooltip: {
        prefix: '',
        format: '',
        suffix: ''
      }
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
