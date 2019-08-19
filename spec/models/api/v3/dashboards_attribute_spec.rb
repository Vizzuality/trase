require 'rails_helper'
require 'models/api/v3/shared_attributes_examples'

RSpec.describe Api::V3::DashboardsAttribute, type: :model do
  describe :destroy_zombies do
    let!(:referenced) { FactoryBot.create(:api_v3_dashboards_attribute) }
    let!(:dashboards_ind) {
      FactoryBot.create(
        :api_v3_dashboards_ind,
        dashboards_attribute: referenced,
        ind: FactoryBot.create(:api_v3_ind)
      )
    }
    let!(:zombie) { FactoryBot.create(:api_v3_dashboards_attribute) }
    let(:subject) { Api::V3::DashboardsAttribute }
    include_examples 'destroys zombies'
  end
end
