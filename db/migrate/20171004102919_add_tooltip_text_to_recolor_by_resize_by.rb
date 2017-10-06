class AddTooltipTextToRecolorByResizeBy < ActiveRecord::Migration[5.0]
  def up
    add_column :context_resize_by, :tooltip_text, :text
    add_column :context_recolor_by, :tooltip_text, :text

    update_sql = <<-SQL
UPDATE context_resize_by
SET tooltip_text = CASE resize_attribute_id
WHEN 12 THEN ''
WHEN 15 THEN 'Annual deforestation due to direct conversion for soy (ha) (currently only in Cerrado biome, 2010-2013). This deforestation rate is allocated to the actors along the supply chain in proportion to the volume of a soy that they export from a given jurisdiction relative to the total production of soy (by all actors) in the same jurisdiction.' 
WHEN 22 THEN 'Amount of the traded commodity (tons). The total value is a composite of traded sub-products, which are converted to their original raw equivalents and then aggregated. For example exports of soy cake and soy oil are converted to soybean equivalents in the areas of production, where farmers are just producing beans.'
WHEN 26 THEN 'Area of land being used to produce the traded commodity. Based on exported volumes and yield values per jurisdiction. '
WHEN 27 THEN 'Value of the traded product in US dollars as it flows along the supply chain based on the value of the shipment as reported at the port of export (termed Freight on Board value, or FOB). Based on customs and trade data.'
WHEN 31 THEN 'Total deforestation per municipality for a given year (ha). Calculated only for forested and wooded biomes - the Amazon, Cerrado and Atlantic Forest. Clearance of native vegetation in Brazil´s other biomes (Caatinga, Pantanal and Pampas) is not considered as deforestation in this indicator.'
WHEN 32 THEN 'Maximum potential soy-related deforestation (ha). Calculated as the maximum deforestation in the year prior to soy being harvested that could be attributable to soy expansion for that harvest. As an example, in a municipality with 1000 ha of soy expansion between 2014-2015, but only 400 ha of deforestation in 2014, the potential soy-related deforestation during 2014 could not be more than 400 ha. The remaining 600 ha of soy, at a minimum, expanded onto non-forest land, typically cattle pasture. This expansion may contribute towards the displacement of other land uses into forest land, a phenomenon known as indirect land-use change. Calculated only for forested and wooded biomes - the Amazon, Cerrado and Atlantic Forest. Clearance of native vegetation in Brazil´s other biomes (Caatinga, Pantanal and Pampas) is not considered as deforestation in this indicator.'
END
WHERE context_resize_by.resize_attribute_type = 'Quant'
;

UPDATE context_recolor_by
SET tooltip_text = CASE recolor_attribute_id
WHEN 4 THEN 'Colour supply chain flows based on level of criticality of water stress (1-7), calculated as the median water stress level per municipality, in terms of percentage of available blue water.'
WHEN 10 THEN 'Colour the supply chain flows according to density of smallholders, defined as the proportion of total property area in the hands of legally defined family farmers versus the total area of all properties. Based on 2006 census data.'
WHEN 16 THEN 'Colour supply chain flows based on area of land in permanent protected areas and legal reserves that must be restored or compensated for (legal reserve only) to achieve compliance with the Brazilian Forest Code - as a percentage of the total area of private land. Based on 2017 analysis.'
WHEN 21 THEN 'Colour supply chain flows based on the Forest 500 index, which ranks traders according to the strength of their sustainability commitments.'
END
WHERE context_recolor_by.recolor_attribute_type = 'Ind'
;

UPDATE context_recolor_by
SET tooltip_text = CASE recolor_attribute_id
WHEN 1 THEN 'Colour supply chain flows based on whether different soy traders have zero deforestation commitments or not.'
WHEN 4 THEN 'Colour supply chain flows in accordance with the biome of the sourcing region.'
END
WHERE context_recolor_by.recolor_attribute_type = 'Qual'
;
    SQL
    execute update_sql
  end

  def down
    remove_column :context_resize_by, :tooltip
    remove_column :context_recolor_by, :tooltip
  end
end
