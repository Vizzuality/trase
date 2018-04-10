class NodeTypeName < EnumerateIt::Base
  associate_values(BIOME: 'BIOME',
                   STATE: 'STATE',
                   LOGISTICS_HUB: 'LOGISTICS HUB',
                   MUNICIPALITY: 'MUNICIPALITY',
                   EXPORTER: 'EXPORTER',
                   PORT: 'PORT',
                   IMPORTER: 'IMPORTER',
                   COUNTRY: 'COUNTRY',
                   TRADER: 'TRADER',
                   DEPARTMENT: 'DEPARTMENT',
                   COUNTRY_OF_PRODUCTION: 'COUNTRY OF PRODUCTION',
                   CUSTOMS_DEPARTMENT: 'CUSTOMS DEPARTMENT')
end
