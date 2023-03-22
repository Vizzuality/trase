require "rails_helper"
require "services/api/v3/database_validation/checks/shared_check_examples"

RSpec.describe Api::V3::DatabaseValidation::Checks::DeclaredYearsMatchFlowAttributes do
  context "when checking resize_by_attributes" do
    let(:context) { FactoryBot.create(:api_v3_context) }
    let(:quant) { FactoryBot.create(:api_v3_quant) }
    let(:resize_by_attribute) {
      FactoryBot.create(
        :api_v3_resize_by_attribute,
        context: context,
        years: [2014, 2015]
      )
    }
    let!(:resize_by_quant) {
      FactoryBot.create(
        :api_v3_resize_by_quant,
        resize_by_attribute: resize_by_attribute,
        quant: quant
      )
    }
    let(:flow_path) {
      Array.new(Api::V3::Flow::MINIMUM_LENGTH) do
        FactoryBot.create(:api_v3_node).id
      end
    }
    let(:flow_2014) {
      FactoryBot.create(
        :api_v3_flow, context: context, path: flow_path, year: 2014
      )
    }
    let!(:flow_quant_2014) {
      FactoryBot.create(:api_v3_flow_quant, flow: flow_2014, quant: quant)
    }

    let(:check) {
      Api::V3::DatabaseValidation::Checks::DeclaredYearsMatchFlowAttributes.new(
        resize_by_attribute,
        association: :resize_by_quant
      )
    }
    let(:report_status) {
      Api::V3::DatabaseValidation::ErrorsList.new
    }
    context "when years dont match" do
      include_examples "failing checks"
    end

    context "when years match" do
      let(:flow_2015) {
        FactoryBot.create(
          :api_v3_flow, context: context, path: flow_path, year: 2015
        )
      }
      let!(:flow_quant_2015) {
        FactoryBot.create(:api_v3_flow_quant, flow: flow_2015, quant: quant)
      }

      include_examples "passing checks"
    end
  end
end
