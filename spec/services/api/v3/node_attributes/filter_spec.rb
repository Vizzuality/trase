require "rails_helper"

RSpec.describe Api::V3::NodeAttributes::Filter do
  include_context "api v3 brazil map attributes"
  include_context "api v3 brazil municipality quant values"

  before(:each) do
    Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
  end

  let(:node_attributes) {
    filter.result
  }
  let(:municipality_land_conflicts) {
    node_attributes.find do |node_attr|
      node_attr["node_id"] == api_v3_municipality_node.id &&
        node_attr["attribute_id"] == api_v3_land_conflicts.id &&
        node_attr["attribute_type"] == "quant"
    end
  }

  context "when single year" do
    let!(:api_v3_land_conflicts_value_2015) {
      api_v3_land_conflicts_value.update_attribute(:value, 1)
      api_v3_land_conflicts_value
    }
    let(:filter) {
      Api::V3::NodeAttributes::Filter.new(
        api_v3_brazil_soy_context, 2015, 2015, [api_v3_land_conflicts_map_attribute.id]
      )
    }
    # buckets [6, 10, 15]
    it "value is in dual layer bucket 1" do
      expect(municipality_land_conflicts["dual_layer_bucket"]).to eq(1)
    end
    # buckets [1, 3, 7, 15]
    it "value is in single layer bucket 2" do
      expect(municipality_land_conflicts["single_layer_bucket"]).to eq(2)
    end
  end

  context "when multi year" do
    let!(:api_v3_land_conflicts_map_attribute_multi_year) {
      api_v3_land_conflicts_map_attribute.update_attribute(:years, [2014, 2015])
      api_v3_land_conflicts_map_attribute
    }
    let!(:api_v3_land_conflicts_value_2014) {
      Api::V3::NodeQuant.where(
        node_id: api_v3_municipality_node.id,
        quant_id: api_v3_land_conflicts.id,
        year: 2014
      ).first ||
        FactoryBot.create(
          :api_v3_node_quant,
          node: api_v3_municipality_node,
          quant: api_v3_land_conflicts,
          value: 20,
          year: 2014
        )
    }
    let(:filter) {
      Api::V3::NodeAttributes::Filter.new(
        api_v3_brazil_soy_context, 2014, 2015, [api_v3_land_conflicts_map_attribute.id]
      )
    }

    # aggregated buckets [12, 20, 30]
    it "value is in dual layer bucket 3" do
      expect(municipality_land_conflicts["dual_layer_bucket"]).to eq(3)
    end

    # aggregated buckets [2, 6, 14, 30]
    it "value is in single layer bucket 4" do
      expect(municipality_land_conflicts["single_layer_bucket"]).to eq(4)
    end
  end
end
