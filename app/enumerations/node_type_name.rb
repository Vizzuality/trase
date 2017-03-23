class NodeTypeName < EnumerateIt::Base
  associate_values({
    BIOME: 'BIOME',
    STATE: 'STATE',
    LOGISTICS_HUB: 'LOGISTICS HUB',
    MUNICIPALITY: 'MUNICIPALITY',
    EXPORTER: 'EXPORTER',
    PORT: 'PORT',
    IMPORTER: 'IMPORTER',
    COUNTRY: 'COUNTRY',
    TRADER: 'TRADER'
  })
end
