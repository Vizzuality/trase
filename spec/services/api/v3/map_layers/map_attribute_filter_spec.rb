require "rails_helper"

RSpec.describe Api::V3::MapLayers::MapAttributeFilter do
  include_context "api v3 brazil map attributes"

  before(:each) do
    Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
  end

  context "when single year" do
    it "returns dual layer buckets as is" do
      filter = Api::V3::MapLayers::MapAttributeFilter.new(
        api_v3_brazil_soy_context, 2015, 2015
      )
      map_attributes = filter.call
      land_conflicts = map_attributes.find { |attr| attr["id"] == api_v3_land_conflicts_map_attribute.id }
      expect(land_conflicts["dual_layer_buckets"]).to eq([6, 10, 15])
    end
    it "returns single layer buckets as is" do
      filter = Api::V3::MapLayers::MapAttributeFilter.new(
        api_v3_brazil_soy_context, 2015, 2015
      )
      map_attributes = filter.call
      land_conflicts = map_attributes.find { |attr| attr["id"] == api_v3_land_conflicts_map_attribute.id }
      expect(land_conflicts["single_layer_buckets"]).to eq([1, 3, 7, 15])
    end
  end

  context "when multi year" do
    let(:api_v3_land_conflicts_map_attribute_multi_year) {
      api_v3_land_conflicts_map_attribute.update_attribute(:years, [2014, 2015])
      api_v3_land_conflicts_map_attribute
    }
    it "returns dual layer buckets as is" do
      filter = Api::V3::MapLayers::MapAttributeFilter.new(
        api_v3_brazil_soy_context, 2014, 2015
      )
      map_attributes = filter.call
      land_conflicts = map_attributes.find { |attr| attr["id"] == api_v3_land_conflicts_map_attribute.id }
      expect(land_conflicts["dual_layer_buckets"]).to eq([12, 20, 30])
    end
    it "returns single layer buckets as is" do
      filter = Api::V3::MapLayers::MapAttributeFilter.new(
        api_v3_brazil_soy_context, 2014, 2015
      )
      map_attributes = filter.call
      land_conflicts = map_attributes.find { |attr| attr["id"] == api_v3_land_conflicts_map_attribute.id }
      expect(land_conflicts["single_layer_buckets"]).to eq([2, 6, 14, 30])
    end
  end
end
