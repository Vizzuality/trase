require 'rails_helper'
require 'services/api/v3/database_validation/checks/shared_check_examples'

RSpec.describe Api::V3::DatabaseValidation::Checks::DeclaredTemporalMatchesData do
  context 'when checking quants' do
    let(:context) { FactoryBot.create(:api_v3_context) }
    let(:quant) { FactoryBot.create(:api_v3_quant) }

    let(:check) {
      Api::V3::DatabaseValidation::Checks::DeclaredTemporalMatchesData.new(
        quant,
        association: :node_quants,
        attribute: :is_temporal_on_actor_profile,
        on: :quant_property
      )
    }
    let(:report_status) {
      Api::V3::DatabaseValidation::ErrorsList.new
    }
    context 'when temporal and years blank' do
      let!(:quant_property) {
        FactoryBot.create(
          :api_v3_quant_property,
          quant: quant,
          is_temporal_on_actor_profile: true
        )
      }
      let!(:node_quant) {
        FactoryBot.create(:api_v3_node_quant, quant: quant, year: nil)
      }
      include_examples 'failing checks'
    end

    context 'when not temporal and years present' do
      let!(:quant_property) {
        FactoryBot.create(
          :api_v3_quant_property,
          quant: quant,
          is_temporal_on_actor_profile: false
        )
      }
      let!(:node_quant) {
        FactoryBot.create(:api_v3_node_quant, quant: quant, year: 2015)
      }
      include_examples 'failing checks'
    end

    context 'when temporal and years present' do
      let!(:quant_property) {
        FactoryBot.create(
          :api_v3_quant_property,
          quant: quant,
          is_temporal_on_actor_profile: true
        )
      }
      let!(:node_quant) {
        FactoryBot.create(:api_v3_node_quant, quant: quant, year: 2015)
      }
      include_examples 'passing checks'
    end

    context 'when not temporal and years blank' do
      let!(:quant_property) {
        FactoryBot.create(
          :api_v3_quant_property,
          quant: quant,
          is_temporal_on_actor_profile: false
        )
      }
      let!(:node_quant) {
        FactoryBot.create(:api_v3_node_quant, quant: quant, year: nil)
      }
      include_examples 'passing checks'
    end
  end
end
