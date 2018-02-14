require 'rails_helper'
require 'modules/api/v3/database_checks/shared_check_examples'

RSpec.describe Api::V3::DatabaseChecks::HasManyAssociationAny do
  before do
    Api::V3::ResizeByAttribute.skip_callback(:commit, :after, :refresh_dependencies)
  end
  after do
    Api::V3::ResizeByAttribute.set_callback(:commit, :after, :refresh_dependencies)
  end

  context 'when checking context resize_by_attributes' do
    let(:context) {
      FactoryBot.create(:api_v3_context)
    }
    let(:check) {
      Api::V3::DatabaseChecks::HasManyAssociationAny.new(
        context,
        association: :resize_by_attributes
      )
    }
    let(:report_status) {
      Api::V3::DatabaseChecks::ReportStatus.new
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
end
