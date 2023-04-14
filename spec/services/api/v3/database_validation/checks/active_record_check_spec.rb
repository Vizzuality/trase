require "rails_helper"
require "services/api/v3/database_validation/checks/shared_check_examples"

RSpec.describe Api::V3::DatabaseValidation::Checks::ActiveRecordCheck do
  context "when checking recolor_by attributes" do
    let(:context) { FactoryBot.create(:api_v3_context) }
    let(:ind) { FactoryBot.create(:api_v3_ind) }
    let(:recolor_by_attribute) {
      FactoryBot.create(:api_v3_recolor_by_attribute, context: context)
    }
    let!(:recolor_by_ind) {
      FactoryBot.create(
        :api_v3_recolor_by_ind,
        recolor_by_attribute: recolor_by_attribute,
        ind: ind
      )
    }
    let(:check) {
      Api::V3::DatabaseValidation::Checks::ActiveRecordCheck.new(
        recolor_by_attribute
      )
    }
    let(:report_status) {
      Api::V3::DatabaseValidation::ErrorsList.new
    }
    context "when ind linked to another recolor_by_attribute" do
      let!(:another_recolor_by_ind) {
        tmp = FactoryBot.create(
          :api_v3_recolor_by_ind,
          recolor_by_attribute: FactoryBot.create(
            :api_v3_recolor_by_attribute, context: context
          )
        )
        tmp.update_attribute(:ind_id, ind.id) # skip AR validation
        tmp
      }
      include_examples "failing checks"
    end

    context "when quant linked to a single recolor_by_attribute" do
      include_examples "passing checks"
    end
  end
end
