shared_context "api v3 quants" do
  let(:api_v3_area) do
    q = Api::V3::Quant.find_by_name("AREA_KM2")
    unless q
      q = FactoryBot.create(
        :api_v3_quant,
        name: "AREA_KM2",
        unit: "km2"
      )
      FactoryBot.create(
        :api_v3_quant_property,
        quant: q,
        unit_type: "area",
        tooltip_text: "Municipal area according in Km2",
        display_name: "Area",
        aggregation_method: "AVG"
      )
    end
    q
  end
  let(:api_v3_land_conflicts) do
    q = Api::V3::Quant.find_by_name("LAND_CONFL")
    unless q
      q = FactoryBot.create(
        :api_v3_quant,
        name: "LAND_CONFL",
        unit: "Number"
      )
      FactoryBot.create(
        :api_v3_quant_property,
        quant: q,
        unit_type: "count",
        tooltip_text: "Number of land conflicts per municipality",
        display_name: "Land conflicts (2014)",
        aggregation_method: "SUM"
      )
    end
    q
  end
  let(:api_v3_force_labour) do
    q = Api::V3::Quant.find_by_name("SLAVERY")
    unless q
      q = FactoryBot.create(
        :api_v3_quant,
        name: "SLAVERY",
        unit: "Number"
      )
      FactoryBot.create(
        :api_v3_quant_property,
        quant: q,
        unit_type: "count",
        tooltip_text: "Number of people involved in lawsuits relating to cases fo forced labor or degrading working conditions",
        display_name: "Reported cases of forced labour (2014)",
        aggregation_method: "SUM"
      )
    end
    q
  end
  let(:api_v3_embargoes) do
    q = Api::V3::Quant.find_by_name("EMBARGOES_")
    unless q
      q = FactoryBot.create(
        :api_v3_quant,
        name: "EMBARGOES_",
        unit: "Number"
      )
      FactoryBot.create(
        :api_v3_quant_property,
        quant: q,
        unit_type: "count",
        tooltip_text: "Number of fines and embargos associated with infringements of environmental legislations per municipality",
        display_name: "Number of environmental embargos (2015)",
        aggregation_method: "SUM"
      )
    end
    q
  end
  let(:api_v3_fob) do
    q = Api::V3::Quant.find_by_name("FOB")
    unless q
      q = FactoryBot.create(
        :api_v3_quant,
        name: "FOB",
        unit: "USD"
      )
      FactoryBot.create(
        :api_v3_quant_property,
        quant: q,
        tooltip_text: "Value of commodity shipments",
        display_name: "Financial flow",
        aggregation_method: "SUM"
      )
    end
    q
  end
  let(:api_v3_deforestation_v2) do
    q = Api::V3::Quant.find_by_name("DEFORESTATION_V2")
    unless q
      q = FactoryBot.create(
        :api_v3_quant,
        name: "DEFORESTATION_V2",
        unit: "Ha"
      )
      FactoryBot.create(
        :api_v3_quant_property,
        quant: q,
        tooltip_text: "Total deforestation per municipality for a given year (ha). Calculated only for forested and wooded biomes - the Amazon, Cerrado and Atlantic Forest. Clearance of native vegetation in Brazil´s other biomes (Caatinga, Pantanal and Pampas) is not considered as deforestation in this indicator.",
        display_name: "Territorial deforestation",
        aggregation_method: "SUM"
      )
    end
    q
  end
  let(:api_v3_population) do
    q = Api::V3::Quant.find_by_name("POPULATION")
    unless q
      q = FactoryBot.create(
        :api_v3_quant,
        name: "POPULATION",
        unit: "Number"
      )
      FactoryBot.create(
        :api_v3_quant_property,
        quant: q,
        tooltip_text: "Population per municipality",
        display_name: "Population",
        aggregation_method: "AVG"
      )
    end
    q
  end
  let(:api_v3_soy_tn) do
    q = Api::V3::Quant.find_by_name("SOY_TN")
    unless q
      q = FactoryBot.create(
        :api_v3_quant,
        name: "SOY_TN",
        unit: "Tn"
      )
      FactoryBot.create(
        :api_v3_quant_property,
        quant: q,
        tooltip_text: "Production of soy in Tn.",
        display_name: "Production of soy",
        aggregation_method: "SUM"
      )
    end
    q
  end
  let(:api_v3_potential_soy_deforestation_v2) do
    q = Api::V3::Quant.find_by_name("POTENTIAL_SOY_DEFORESTATION_V2")
    unless q
      q = FactoryBot.create(
        :api_v3_quant,
        name: "POTENTIAL_SOY_DEFORESTATION_V2",
        unit: "Ha"
      )
      FactoryBot.create(
        :api_v3_quant_property,
        quant: q,
        tooltip_text: "Maximum potential soy-related deforestation (ha). Calculated as the maximum deforestation in the year prior to soy being harvested that could be attributable to soy expansion for that harvest. As an example, in a municipality with 1000 ha of soy expansion between 2014-2015, but only 400 ha of deforestation in 2014, the potential soy-related deforestation during 2014 could not be more than 400 ha. The remaining 600 ha of soy, at a minimum, expanded onto non-forest land, typically cattle pasture. This expansion may contribute towards the displacement of other land uses into forest land, a phenomenon known as indirect land-use change. Calculated only for forested and wooded biomes - the Amazon, Cerrado and Atlantic Forest. Clearance of native vegetation in Brazil´s other biomes (Caatinga, Pantanal and Pampas) is not considered as deforestation in this indicator.",
        display_name: "Maximum soy deforestation",
        aggregation_method: "SUM"
      )
    end
    q
  end
  let(:api_v3_soy_) do
    q = Api::V3::Quant.find_by_name("SOY_")
    unless q
      q = FactoryBot.create(
        :api_v3_quant,
        name: "SOY_",
        unit: "Tn"
      )
      FactoryBot.create(
        :api_v3_quant_property,
        quant: q,
        tooltip_text: "Total exports in Tn of soy equivalents",
        display_name: "Soy exports for trader",
        aggregation_method: "SUM"
      )
    end
    q
  end
  let(:api_v3_agrosatelite_soy_defor_) do
    q = Api::V3::Quant.find_by_name("AGROSATELITE_SOY_DEFOR_")
    unless q
      q = FactoryBot.create(
        :api_v3_quant,
        name: "AGROSATELITE_SOY_DEFOR_",
        unit: "Tn"
      )
      FactoryBot.create(
        :api_v3_quant_property,
        quant: q,
        tooltip_text: "Annual deforestation due to direct conversion for soy (ha) (currently only in Cerrado biome, 2010-2013). Calculated by crossing per-pixel annual deforestation alerts and soy crop maps.",
        display_name: "Soy deforestation (Cerrado only)",
        aggregation_method: "SUM"
      )
    end
    q
  end
  let!(:api_v3_volume) do
    q = Api::V3::Quant.find_by_name("Volume")
    unless q
      q = FactoryBot.create(
        :api_v3_quant,
        name: "Volume",
        unit: "Tn"
      )
      FactoryBot.create(
        :api_v3_quant_property,
        quant: q,
        display_name: "Trade volume",
        aggregation_method: "SUM"
      )
    end
    q
  end
  let(:api_v3_land_use) do
    q = Api::V3::Quant.find_by_name("LAND_USE")
    unless q
      q = FactoryBot.create(
        :api_v3_quant,
        name: "LAND_USE",
        unit: "Ha"
      )
      FactoryBot.create(
        :api_v3_quant_property,
        quant: q,
        display_name: "Land use",
        aggregation_method: "AVG"
      )
    end
    q
  end
  let(:api_v3_biodiversity) do
    q = Api::V3::Quant.find_by_name("BIODIVERSITY")
    unless q
      q = FactoryBot.create(
        :api_v3_quant,
        name: "BIODIVERSITY",
        unit: "Unitless"
      )
      FactoryBot.create(
        :api_v3_quant_property,
        quant: q,
        display_name: "Loss of biodiversity habitat",
        aggregation_method: "SUM"
      )
    end
    q
  end
  let(:api_v3_ghg_) do
    q = Api::V3::Quant.find_by_name("GHG_")
    unless q
      q = FactoryBot.create(
        :api_v3_quant,
        name: "GHG_",
        unit: "mt/yr"
      )
      FactoryBot.create(
        :api_v3_quant_property,
        quant: q,
        display_name: "Loss of biodiversity habitat",
        aggregation_method: "SUM"
      )
    end
    q
  end
end
