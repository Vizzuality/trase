require 'rails_helper'
require 'services/api/v3/database_validation/checks/shared_check_examples'

RSpec.describe Api::V3::DatabaseValidation::Checks::HasOneAssociationVariantPresent do
  context 'when checking map attributes' do
    before do
      Api::V3::MapAttributeGroup.skip_callback(:commit, :after, :refresh_dependencies)
      Api::V3::MapAttribute.skip_callback(:commit, :after, :refresh_dependencies)
    end
    after do
      Api::V3::MapAttributeGroup.set_callback(:commit, :after, :refresh_dependencies)
      Api::V3::MapAttribute.set_callback(:commit, :after, :refresh_dependencies)
    end

    let(:map_attribute) {
      FactoryBot.create(:api_v3_map_attribute)
    }
    let(:check) {
      Api::V3::DatabaseValidation::Checks::HasOneAssociationVariantPresent.new(
        map_attribute,
        associations: [:map_ind, :map_quant]
      )
    }
    let(:report_status) {
      Api::V3::DatabaseValidation::ErrorsList.new
    }
    context 'when map_ind and map_quant missing' do
      include_examples 'failing checks'
    end

    context 'when map_ind and map_quant present' do
      let!(:map_ind) {
        FactoryBot.create(:api_v3_map_ind, map_attribute: map_attribute)
      }
      let!(:map_quant) {
        FactoryBot.create(:api_v3_map_quant, map_attribute: map_attribute)
      }
      include_examples 'failing checks'
    end

    context 'when map_ind present' do
      let!(:map_ind) {
        FactoryBot.create(:api_v3_map_ind, map_attribute: map_attribute)
      }
      include_examples 'passing checks'
    end
  end
end
