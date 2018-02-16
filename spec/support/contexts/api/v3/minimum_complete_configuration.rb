shared_context 'minimum complete configuration' do
  let(:context) {
    FactoryBot.create(:api_v3_context)
  }
  let(:qual) { FactoryBot.create(:api_v3_qual) }
  let(:quant) { FactoryBot.create(:api_v3_quant) }
  let(:ind) { FactoryBot.create(:api_v3_ind) }
  let!(:context_property) {
    FactoryBot.create(:api_v3_context_property, context: context)
  }
  let(:exporter_node_type) {
    FactoryBot.create(:api_v3_node_type, name: NodeTypeName::EXPORTER)
  }
  let(:municipality_node_type) {
    FactoryBot.create(:api_v3_node_type, name: NodeTypeName::MUNICIPALITY)
  }
  let(:country_node_type) {
    FactoryBot.create(:api_v3_node_type, name: NodeTypeName::COUNTRY)
  }
  let(:exporter_context_node_type) {
    FactoryBot.create(
      :api_v3_context_node_type,
      context: context,
      node_type: exporter_node_type
    )
  }
  let(:municipality_context_node_type) {
    FactoryBot.create(
      :api_v3_context_node_type,
      context: context,
      node_type: municipality_node_type
    )
  }
  let(:country_context_node_type) {
    FactoryBot.create(
      :api_v3_context_node_type,
      context: context,
      node_type: country_node_type
    )
  }
  let!(:exporter_context_node_type_property) {
    FactoryBot.create(
      :api_v3_context_node_type_property,
      context_node_type: exporter_context_node_type
    )
  }
  let!(:municipality_context_node_type_property) {
    FactoryBot.create(
      :api_v3_context_node_type_property,
      context_node_type: municipality_context_node_type
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
      tooltip_text: 'text'
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
      tooltip_text: 'text'
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
  let(:flow_2014) {
    FactoryBot.create(:api_v3_flow, context: context, year: 2014)
  }
  let!(:flow_quant_2014) {
    FactoryBot.create(:api_v3_flow_quant, flow: flow_2014, quant: quant)
  }
  let!(:flow_ind_2014) {
    FactoryBot.create(:api_v3_flow_ind, flow: flow_2014, ind: ind)
  }
end
