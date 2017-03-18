class NodeTypeName < EnumerateIt::Base
  associate_values(
      :BIOME,
      :STATE,
      :LOGISTICS_HUB,
      :MUNICIPALITY,
      :EXPORTER,
      :PORT,
      :IMPORTER,
      :COUNTRY,
      :TRADER
  )
end
