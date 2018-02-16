require 'rails_helper'
require 'services/api/v3/database_validation/checks/shared_check_examples'

RSpec.describe Api::V3::DatabaseValidation::Checks::HasManyAssociationAny do
  let(:context) {
    FactoryBot.create(:api_v3_context)
  }
  let(:report_status) {
    Api::V3::DatabaseValidation::ErrorsList.new
  }

  context 'when checking context resize_by_attributes' do
    before do
      Api::V3::ResizeByAttribute.skip_callback(:commit, :after, :refresh_dependencies)
    end
    after do
      Api::V3::ResizeByAttribute.set_callback(:commit, :after, :refresh_dependencies)
    end

    let(:check) {
      Api::V3::DatabaseValidation::Checks::HasManyAssociationAny.new(
        context,
        association: :resize_by_attributes
      )
    }
    context 'when resize_by_attributes missing' do
      include_examples 'failing checks'
    end

    context 'when resize_by_attributes present' do
      let!(:resize_by_attribute) {
        FactoryBot.create(:api_v3_resize_by_attribute, context: context)
      }
      include_examples 'passing checks'
    end
  end

  context 'when checking context actor profiles' do
    let!(:context_node_type) {
      FactoryBot.create(:api_v3_context_node_type, context: context)
    }
    let(:check) {
      Api::V3::DatabaseValidation::Checks::HasManyAssociationAny.new(
        context,
        association: :profiles,
        conditions: {'profiles.name' => Api::V3::Profile::ACTOR},
        severity: :warn
      )
    }

    context 'when actor profile missing' do
      include_examples 'failing checks'
    end

    context 'when actor profile present' do
      let!(:actor_profile) {
        FactoryBot.create(
          :api_v3_profile,
          context_node_type: context_node_type,
          name: Api::V3::Profile::ACTOR
        )
      }
      include_examples 'passing checks'
    end
  end
end
