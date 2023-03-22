require "rails_helper"
require "models/api/v3/shared_attributes_examples"

RSpec.describe Api::V3::RecolorByAttribute, type: :model do
  include_context "api v3 brazil recolor by attributes"
  include_context "api v3 node types"

  describe :validate do
    let(:attribute_without_context) {
      FactoryBot.build(:api_v3_recolor_by_attribute, context: nil)
    }
    it "fails when context missing" do
      expect(attribute_without_context).to have(2).errors_on(:context)
    end
  end

  describe :destroy_zombies do
    let!(:referenced) { FactoryBot.create(:api_v3_recolor_by_attribute) }
    let!(:recolor_by_ind) {
      FactoryBot.create(
        :api_v3_recolor_by_ind,
        recolor_by_attribute: referenced,
        ind: FactoryBot.create(:api_v3_ind)
      )
    }
    let!(:zombie) { FactoryBot.create(:api_v3_recolor_by_attribute) }
    let(:subject) { Api::V3::RecolorByAttribute }
    include_examples "destroys zombies"
  end

  describe :save do
    let(:years) { [2017, 2018, 2019] }
    let(:qual) { FactoryBot.create(:api_v3_qual) }
    let(:recolor_by_attribute) {
      FactoryBot.build(:api_v3_recolor_by_attribute, context: api_v3_brazil_soy_context)
    }
    let!(:recolor_by_qual) {
      FactoryBot.build(
        :api_v3_recolor_by_qual,
        recolor_by_attribute: recolor_by_attribute,
        qual: qual
      )
    }
    before(:each) do
      years.each do |year|
        flow = FactoryBot.create(
          :api_v3_flow,
          path: [
            FactoryBot.create(:api_v3_node, node_type: api_v3_biome_node_type),
            FactoryBot.create(:api_v3_node, node_type: api_v3_state_node_type),
            FactoryBot.create(:api_v3_node, node_type: api_v3_municipality_node_type),
            FactoryBot.create(:api_v3_node, node_type: api_v3_logistics_hub_node_type),
            FactoryBot.create(:api_v3_node, node_type: api_v3_port_node_type),
            FactoryBot.create(:api_v3_node, node_type: api_v3_exporter_node_type),
            FactoryBot.create(:api_v3_node, node_type: api_v3_importer_node_type),
            FactoryBot.create(:api_v3_node, node_type: api_v3_country_node_type)
          ].map(&:id),
          context: api_v3_brazil_soy_context,
          year: year
        )
        FactoryBot.create(:api_v3_flow_qual, flow: flow, qual: qual)
      end
    end

    it "automatically populates available years" do
      Sidekiq::Testing.inline! do
        recolor_by_attribute.save
      end
      expect(recolor_by_attribute.reload.years).to eq(years)
    end
  end
end
