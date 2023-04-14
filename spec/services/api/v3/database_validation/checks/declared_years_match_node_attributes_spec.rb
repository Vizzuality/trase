require "rails_helper"
require "services/api/v3/database_validation/checks/shared_check_examples"

RSpec.describe Api::V3::DatabaseValidation::Checks::DeclaredYearsMatchNodeAttributes do
  context "when checking resize_by_attributes" do
    let(:context) { FactoryBot.create(:api_v3_context) }
    let(:quant) { FactoryBot.create(:api_v3_quant) }
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
        years: [2014, 2015]
      )
    }
    let!(:map_quant) {
      FactoryBot.create(
        :api_v3_map_quant,
        map_attribute: map_attribute,
        quant: quant
      )
    }
    let!(:node_quant_2014) {
      FactoryBot.create(:api_v3_node_quant, quant: quant, year: 2014)
    }

    let(:check) {
      Api::V3::DatabaseValidation::Checks::DeclaredYearsMatchNodeAttributes.new(
        map_attribute,
        association: :map_quant
      )
    }
    let(:report_status) {
      Api::V3::DatabaseValidation::ErrorsList.new
    }
    context "when years dont match" do
      include_examples "failing checks"
    end

    context "when years match" do
      let!(:node_quant_2015) {
        FactoryBot.create(:api_v3_node_quant, quant: quant, year: 2015)
      }

      include_examples "passing checks"
    end
  end
end
