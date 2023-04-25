shared_context "minimum complete configuration" do
  let(:commodity) {
    FactoryBot.create(:api_v3_commodity, name: "Minimum commodity")
  }
  let(:country) { FactoryBot.create(:api_v3_country, name: "Minimum country") }
  let!(:country_property) {
    FactoryBot.create(:api_v3_country_property, country: country)
  }
  let(:context) {
    FactoryBot.create(:api_v3_context, commodity: commodity, country: country)
  }
  let!(:context_property) {
    FactoryBot.create(:api_v3_context_property, context: context)
  }
  let(:ind) { FactoryBot.create(:api_v3_ind) }
  let!(:ind_property) {
    FactoryBot.create(
      :api_v3_ind_property,
      ind: ind,
      tooltip_text: "ind text"
    )
  }
  let(:qual) { FactoryBot.create(:api_v3_qual) }
  let!(:qual_property) {
    FactoryBot.create(
      :api_v3_qual_property,
      qual: qual,
      tooltip_text: "qual text"
    )
  }
  let(:quant) { FactoryBot.create(:api_v3_quant) }
  let!(:quant_property) {
    FactoryBot.create(
      :api_v3_quant_property,
      quant: quant,
      tooltip_text: "quant text"
    )
  }
  let(:biome_node_type) {
    FactoryBot.create(:api_v3_node_type, name: NodeTypeName::BIOME)
  }
  let(:municipality_node_type) {
    FactoryBot.create(:api_v3_node_type, name: NodeTypeName::MUNICIPALITY)
  }
  let(:exporter_node_type) {
    FactoryBot.create(:api_v3_node_type, name: NodeTypeName::EXPORTER)
  }
  let(:country_node_type) {
    FactoryBot.create(:api_v3_node_type, name: NodeTypeName::COUNTRY)
  }

  let(:biome_node) {
    FactoryBot.create(:api_v3_node, node_type: biome_node_type)
  }
  let(:municipality_node) {
    FactoryBot.create(:api_v3_node, node_type: municipality_node_type, main_id: 1)
  }
  let(:exporter_node) {
    FactoryBot.create(:api_v3_node, node_type: exporter_node_type)
  }
  let(:country_node) {
    FactoryBot.create(:api_v3_node, node_type: country_node_type)
  }

  let(:biome_context_node_type) {
    FactoryBot.create(
      :api_v3_context_node_type,
      context: context,
      node_type: biome_node_type,
      column_position: 0
    )
  }
  let(:municipality_context_node_type) {
    FactoryBot.create(
      :api_v3_context_node_type,
      context: context,
      node_type: municipality_node_type,
      column_position: 1
    )
  }
  let(:exporter_context_node_type) {
    FactoryBot.create(
      :api_v3_context_node_type,
      context: context,
      node_type: exporter_node_type,
      column_position: 2
    )
  }
  let(:country_context_node_type) {
    FactoryBot.create(
      :api_v3_context_node_type,
      context: context,
      node_type: country_node_type,
      column_position: 3
    )
  }

  let!(:biome_context_node_type_property) {
    FactoryBot.create(
      :api_v3_context_node_type_property,
      context_node_type: biome_context_node_type
    )
  }
  let!(:municipality_context_node_type_property) {
    FactoryBot.create(
      :api_v3_context_node_type_property,
      context_node_type: municipality_context_node_type
    )
  }
  let!(:exporter_context_node_type_property) {
    FactoryBot.create(
      :api_v3_context_node_type_property,
      context_node_type: exporter_context_node_type
    )
  }
  let!(:country_context_node_type_property) {
    FactoryBot.create(
      :api_v3_context_node_type_property,
      context_node_type: country_context_node_type
    )
  }

  let!(:actor_profile) {
    FactoryBot.create(
      :api_v3_profile,
      context_node_type: exporter_context_node_type,
      name: Api::V3::Profile::ACTOR
    )
  }
  let!(:place_profile) {
    FactoryBot.create(
      :api_v3_profile,
      context_node_type: municipality_context_node_type,
      name: Api::V3::Profile::PLACE
    )
  }
  let(:download_attribute) {
    FactoryBot.create(
      :api_v3_download_attribute,
      context: context,
      years: [2014]
    )
  }
  let!(:download_quant) {
    FactoryBot.create(
      :api_v3_download_quant,
      download_attribute: download_attribute,
      quant: quant
    )
  }
  let(:recolor_by_attribute) {
    FactoryBot.create(
      :api_v3_recolor_by_attribute,
      context: context,
      years: [2014],
      tooltip_text: "text",
      legend_type: "linear"
    )
  }
  let!(:recolor_by_ind) {
    FactoryBot.create(
      :api_v3_recolor_by_ind,
      recolor_by_attribute: recolor_by_attribute,
      ind: ind
    )
  }
  let(:resize_by_attribute) {
    FactoryBot.create(
      :api_v3_resize_by_attribute,
      context: context,
      years: [2014],
      tooltip_text: "text"
    )
  }
  let!(:resize_by_quant) {
    FactoryBot.create(
      :api_v3_resize_by_quant,
      resize_by_attribute: resize_by_attribute,
      quant: quant
    )
  }
  let(:map_attribute_group) {
    FactoryBot.create(
      :api_v3_map_attribute_group,
      context: context
    )
  }
  let(:map_attribute) {
    FactoryBot.create(
      :api_v3_map_attribute,
      map_attribute_group: map_attribute_group,
      years: [2014]
    )
  }
  let!(:map_ind) {
    FactoryBot.create(
      :api_v3_map_ind,
      map_attribute: map_attribute,
      ind: ind
    )
  }
  let!(:node_quant_2014) {
    FactoryBot.create(:api_v3_node_quant, quant: quant, year: 2014)
  }
  let!(:node_ind_2014) {
    FactoryBot.create(:api_v3_node_ind, ind: ind, year: 2014)
  }
  let(:flow_2014) {
    FactoryBot.create(
      :api_v3_flow,
      context: context,
      path: [
        biome_node.id,
        municipality_node.id,
        exporter_node.id,
        country_node.id
      ],
      year: 2014
    )
  }
  let!(:flow_quant_2014) {
    FactoryBot.create(:api_v3_flow_quant, flow: flow_2014, quant: quant)
  }
  let!(:flow_ind_2014) {
    FactoryBot.create(:api_v3_flow_ind, flow: flow_2014, ind: ind)
  }
  let(:contextual_layer) {
    FactoryBot.create(:api_v3_contextual_layer, context: context)
  }
  let!(:carto_layer) {
    FactoryBot.create(:api_v3_carto_layer, contextual_layer: contextual_layer)
  }
end
