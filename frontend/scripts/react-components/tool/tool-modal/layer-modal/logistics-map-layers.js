const MARKERS_URL = NODE_ENV_DEV
  ? 'https://raw.githubusercontent.com/Vizzuality/trase/54cf8892915d11f1401e9bb9dd98ff6590a477c5/frontend/public/images/logistics-map'
  : `https://${window.location.hostname}/images/logistics-map`;

export default {
  BRAZIL: [
    {
      version: '0.0.1',
      id: 'crushing_facilities',
      name: 'crushing facilities',
      description: 'crushing facilities',
      commodityName: 'SOY',
      color: '#EA6869',
      layers: [
        {
          type: 'cartodb',
          options: {
            sql: `SELECT to_date(year::varchar, 'yyyy') as year_date, * FROM "${CARTO_ACCOUNT}".brazil_crushing_facilities where year = {{year}} {{and}}`,
            cartocss: `#layer { marker-width: 7; marker-fill: #EA6869; marker-fill-opacity: 0.9; marker-allow-overlap: true; marker-line-width: 1; marker-line-color: #FFFFFF; marker-line-opacity: 1; } #layer[zoom>4] { marker-line-width: 0.5; marker-fill: #EA6869; marker-file: url('${MARKERS_URL}/crushing-icon-v2.svg'); marker-width: ramp([capacity], range(15, 26), quantiles(7)); }`,
            cartocss_version: '2.3.0',
            interactivity: ['company', 'municipality', 'capacity']
          }
        }
      ],
      params_config: [{ key: 'year', default: 2016 }],
      sql_config: [{ type: 'and', key: 'company', name: 'companies' }],
      downloadUrl: `https://${CARTO_ACCOUNT}.carto.com/api/v2/sql?filename=crushing_facilities&q=SELECT to_date(year::varchar, 'yyyy') as year_date, * FROM "${CARTO_ACCOUNT}".brazil_crushing_facilities&format=csv`
    },
    {
      version: '0.0.1',
      id: 'refining_facilities',
      name: 'refining facilities',
      description: 'refining facilities',
      commodityName: 'SOY',
      color: '#7AC1CA',
      layers: [
        {
          type: 'cartodb',
          options: {
            sql: `SELECT * FROM "${CARTO_ACCOUNT}".brazil_refining_facilities where year = {{year}} {{and}}`,
            cartocss: `#layer { marker-width: 7; marker-fill: #7AC1CA; marker-fill-opacity: 0.9; marker-allow-overlap: true; marker-line-width: 1; marker-line-color: #FFFFFF; marker-line-opacity: 1; } #layer[zoom>4] { marker-line-width: 0.5; marker-fill: #7AC1CA; marker-file: url('${MARKERS_URL}/refining-icon-v2.svg'); marker-width: 24; }`,
            cartocss_version: '2.3.0',
            interactivity: ['company', 'municipality', 'capacity']
          }
        }
      ],
      params_config: [{ key: 'year', default: 2016 }],
      sql_config: [{ type: 'and', key: 'company', name: 'companies' }],
      downloadUrl: `https://${CARTO_ACCOUNT}.carto.com/api/v2/sql?filename=refining_facilities&q=SELECT * FROM "${CARTO_ACCOUNT}".brazil_refining_facilities&format=csv`
    },
    {
      version: '0.0.1',
      id: 'storage_facilities',
      name: 'storage facilities',
      description: 'storage facilities',
      commodityName: 'SOY',
      color: '#F6CF71',
      layers: [
        {
          type: 'cartodb',
          options: {
            sql: `SELECT * FROM "${CARTO_ACCOUNT}".brazil_storage_facilities {{where}}`,
            cartocss: `#layer { marker-width: 7; marker-fill: #F6CF71; marker-fill-opacity: 0.9; marker-allow-overlap: true;  marker-line-color: #FFFFFF; marker-line-width: 1; marker-line-opacity: 1; } #layer[zoom>4] { marker-line-width: 0.5; marker-fill: #F6CF71; marker-file: url('${MARKERS_URL}/storage-icon-v2.svg'); marker-width: ramp([capacity], range(15, 26), quantiles(7)); }`,
            cartocss_version: '2.3.0',
            interactivity: ['company', 'municipality', 'capacity']
          }
        }
      ],
      sql_config: [{ type: 'where', key: 'company', name: 'companies' }],
      downloadUrl: `https://${CARTO_ACCOUNT}.carto.com/api/v2/sql?filename=storage_facilities&q=SELECT * FROM "${CARTO_ACCOUNT}".brazil_storage_facilities&format=csv`
    },
    {
      version: '0.0.1',
      id: 'confirmed_slaughterhouse',
      name: 'confirmed',
      description: 'confirmed',
      commodityName: 'BEEF',
      color: '#F39B73',
      layers: [
        {
          type: 'cartodb',
          options: {
            sql: `SELECT * FROM "${CARTO_ACCOUNT}".slaughterhouses_2018_09_18 where subclass = 'CONFIRMED SLAUGHTERHOUSE' {{and}} {{and2}}`,
            cartocss: `#layer { marker-width: 7; marker-fill: #F39B73; marker-fill-opacity: 0.9; marker-allow-overlap: true; marker-line-width: 1; marker-line-color: #FFFFFF; marker-line-opacity: 1; } #layer[zoom>4] { marker-line-width: 0.5; marker-fill: #F39B73; marker-file: url('${MARKERS_URL}/slaughterhouse-icon-v2.svg'); marker-width: 24; }`,
            cartocss_version: '2.3.0',
            interactivity: ['company', 'state', 'municipality', 'subclass', 'inspection_level']
          }
        }
      ],
      sql_config: [
        { type: 'and', key: 'inspection_level', name: 'inspection' },
        { type: 'and2', key: 'company', name: 'companies' }
      ]
    },
    {
      version: '0.0.1',
      id: 'probable_slaughterhouse',
      name: 'probable',
      description: 'probable',
      commodityName: 'BEEF',
      color: '#F6CF71',
      layers: [
        {
          type: 'cartodb',
          options: {
            sql: `SELECT * FROM "${CARTO_ACCOUNT}".slaughterhouses_2018_09_18 where subclass = 'PROBABLE SLAUGHTERHOUSE' {{and}} {{and2}}`,
            cartocss: `#layer { marker-width: 7; marker-fill: #F6CF71; marker-fill-opacity: 0.9; marker-allow-overlap: true; marker-line-width: 1; marker-line-color: #FFFFFF; marker-line-opacity: 1; } #layer[zoom>4] { marker-line-width: 0.5; marker-fill: #F6CF71; marker-file: url('${MARKERS_URL}/slaughterhouse-icon-v2.svg'); marker-width: 24; }`,
            cartocss_version: '2.3.0',
            interactivity: ['company', 'state', 'municipality', 'subclass', 'inspection_level']
          }
        }
      ],
      sql_config: [
        { type: 'and', key: 'inspection_level', name: 'inspection' },
        { type: 'and2', key: 'company', name: 'companies' }
      ]
    },
    {
      version: '0.0.1',
      id: 'unconfirmed_slaughterhouse',
      name: 'unconfirmed',
      description: 'unconfirmed',
      commodityName: 'BEEF',
      color: '#DCB0F2',
      layers: [
        {
          type: 'cartodb',
          options: {
            sql: `SELECT * FROM "${CARTO_ACCOUNT}".slaughterhouses_2018_09_18 where subclass = 'UNCONFIRMED SLAUGHTERHOUSE' {{and}} {{and2}}`,
            cartocss: `#layer { marker-width: 7; marker-fill: #DCB0F2; marker-fill-opacity: 0.9; marker-allow-overlap: true; marker-line-width: 1; marker-line-color: #FFFFFF; marker-line-opacity: 1; } #layer[zoom>4] { marker-line-width: 0.5; marker-fill: #DCB0F2; marker-file: url('${MARKERS_URL}/slaughterhouse-icon-v2.svg'); marker-width: 24; }`,
            cartocss_version: '2.3.0',
            interactivity: ['company', 'state', 'municipality', 'subclass', 'inspection_level']
          }
        }
      ],
      sql_config: [
        { type: 'and', key: 'inspection_level', name: 'inspection' },
        { type: 'and2', key: 'company', name: 'companies' }
      ]
    },
    {
      version: '0.0.1',
      id: 'unconfirmed_slaughterhouse_multifunctional_facility',
      name: 'unconfirmed (multi-functional)',
      description: 'unconfirmed (multi-functional)',
      commodityName: 'BEEF',
      color: '#7AC1CA',
      layers: [
        {
          type: 'cartodb',
          options: {
            sql: `SELECT * FROM "${CARTO_ACCOUNT}".slaughterhouses_2018_09_18 where subclass = 'UNCONFIRMED SLAUGHTERHOUSE (MULTIFUNCTIONAL FACILITY)' {{and}} {{and2}}`,
            cartocss: `#layer { marker-width: 7; marker-fill: #7AC1CA; marker-fill-opacity: 0.9; marker-allow-overlap: true; marker-line-width: 1; marker-line-color: #FFFFFF; marker-line-opacity: 1; } #layer[zoom>4] { marker-line-width: 0.5; marker-fill: #7AC1CA; marker-file: url('${MARKERS_URL}/slaughterhouse-icon-v2.svg'); marker-width: 24; }`,
            cartocss_version: '2.3.0',
            interactivity: ['company', 'state', 'municipality', 'subclass', 'inspection_level']
          }
        }
      ],
      sql_config: [
        { type: 'and', key: 'inspection_level', name: 'inspection' },
        { type: 'and2', key: 'company', name: 'companies' }
      ]
    },
    {
      version: '0.0.1',
      id: 'slaughterhouses download',
      name: 'slaughterhouses',
      description: 'slaughterhouses',
      commodityName: 'BEEF',
      downloadUrl: `https://${CARTO_ACCOUNT}.carto.com/api/v2/sql?filename=slaughterhouses&q=SELECT * FROM "${CARTO_ACCOUNT}".slaughterhouses_2018_09_18&format=csv`
    }
  ],
  INDONESIA: [
    {
      version: '0.0.1',
      id: 'mills',
      name: 'mills',
      description: 'mills',
      commodityName: 'PALM OIL',
      color: '#EA6869',
      layers: [
        {
          type: 'cartodb',
          options: {
            sql: `SELECT * FROM "${CARTO_ACCOUNT}".indonesia_palm_oil_mills_20191101 {{where}}`,
            cartocss: `#layer { marker-width: 7; marker-fill: #EA6869; marker-fill-opacity: 0.9; marker-allow-overlap: true; marker-line-width: 1; marker-line-color: #FFFFFF; marker-line-opacity: 1; } #layer[zoom>7] { marker-line-width: 0.5; marker-fill: #EA6869; marker-file: url('${MARKERS_URL}/crushing-icon-v2.svg'); marker-width: 24; }`,
            cartocss_version: '2.3.0',
            interactivity: [
              'mill_id',
              'name',
              'group',
              'company',
              'name',
              'uml_id',
              'rspo_status',
              'rspo_type'
            ]
          }
        }
      ],
      sql_config: [{ type: 'where', key: 'company', name: 'companies' }],
      downloadUrl: `https://${CARTO_ACCOUNT}.carto.com/api/v2/sql?filename=indonesia_palm_oil_mills_20191101&q=SELECT * FROM "${CARTO_ACCOUNT}".indonesia_palm_oil_mills_20191101&format=csv`
    }
  ]
};
