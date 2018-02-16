require 'rails_helper'
require 'services/api/v3/database_validation/checks/shared_check_examples'

RSpec.describe Api::V3::DatabaseValidation::Checks::AttributePresent do
  context 'when checking resize_by_attributes' do
    before do
      Api::V3::ResizeByAttribute.skip_callback(:commit, :after, :refresh_dependencies)
    end
    after do
      Api::V3::ResizeByAttribute.set_callback(:commit, :after, :refresh_dependencies)
    end
    let(:resize_by_attribute) {
      FactoryBot.create(
        :api_v3_resize_by_attribute
      )
    }
    let(:check) {
      Api::V3::DatabaseValidation::Checks::AttributePresent.new(
        resize_by_attribute,
        attribute: :tooltip_text
      )
    }
    let(:report_status) {
      Api::V3::DatabaseValidation::ErrorsList.new
    }
    context 'when tooltip_text missing' do
      include_examples 'failing checks'
    end

    context 'when tooltip_text present' do
      let(:resize_by_attribute) {
        FactoryBot.create(
          :api_v3_resize_by_attribute,
          tooltip_text: 'here we go'
        )
      }
      include_examples 'passing checks'
    end
  end
end
