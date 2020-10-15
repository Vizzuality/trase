require 'rails_helper'

RSpec.describe Api::V3::Readonly::NodeWithFlows, type: :model do
  include_context 'api v3 brazil exporter actor profile'
  include_context 'api v3 brazil importer actor profile'
  include_context 'api v3 brazil exporter quant values'
  include_context 'api v3 brazil exporter qual values'
  include_context 'api v3 brazil exporter ind values'
  include_context 'api v3 brazil importer quant values'
  include_context 'api v3 brazil soy flow quants'

  before(:each) do
    Api::V3::Readonly::FlowNode.refresh(sync: true)
    Api::V3::Readonly::NodeWithFlowsPerYear.refresh(sync: true)
    Api::V3::Readonly::NodeWithFlows.refresh(sync: true)
    Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
  end

  describe 'Methods' do
    describe '#refresh_actor_basic_attributes' do
      context 'when there is not associated profile' do
        let!(:node_with_flows) do
          profile = api_v3_brazil_soy_context.profiles.find_by(name: :place)
          Api::V3::Readonly::NodeWithFlows.find_by(profile: profile.name)
        end

        it 'do not update actor_basic_attributes' do
          expect(node_with_flows.actor_basic_attributes).to be_nil

          node_with_flows.refresh_actor_basic_attributes
          node_with_flows.reload

          expect(node_with_flows.actor_basic_attributes).to be_nil
        end
      end

      context 'when there is not associated charts' do
        before do
          Api::V3::Chart.where(identifier: :actor_basic_attributes).destroy_all
        end

        let!(:node_with_flows) do
          invalid_profile =
            api_v3_brazil_soy_context.profiles.where(name: :actor).reject do |profile|
              profile.charts.where(identifier: :actor_basic_attributes).any?
            end.first
          Api::V3::Readonly::NodeWithFlows.
            find_by(profile: invalid_profile.name)
        end

        it 'do not update actor_basic_attributes' do
          expect(node_with_flows.actor_basic_attributes).to be_nil

          node_with_flows.refresh_actor_basic_attributes
          node_with_flows.reload

          expect(node_with_flows.actor_basic_attributes).to be_nil
        end
      end

      context 'when there is not associated source chart node type' do
        before do
          Api::V3::ChartNodeType.where(identifier: 'source').destroy_all
        end

        let!(:node_with_flows) do
          invalid_profile =
            api_v3_brazil_soy_context.profiles.where(name: :actor).find do |profile|
              unless profile.charts.where(identifier: :actor_basic_attributes).any?
                return false
              end

              chart_node_types = profile.charts.first.chart_node_types
              source_node_type = chart_node_types.find_by(identifier: 'source')
              source_node_type ? false : true
            end
          Api::V3::Readonly::NodeWithFlows.
            find_by(profile: invalid_profile.name)
        end

        it 'do not update actor_basic_attributes' do
          expect(node_with_flows.actor_basic_attributes).to be_nil

          node_with_flows.refresh_actor_basic_attributes
          node_with_flows.reload

          expect(node_with_flows.actor_basic_attributes).to be_nil
        end
      end

      context 'when there is not associated destination chart node type' do
        before do
          Api::V3::ChartNodeType.where(identifier: 'destination').destroy_all
        end

        let!(:node_with_flows) do
          invalid_profile =
            api_v3_brazil_soy_context.profiles.where(name: :actor).find do |profile|
              unless profile.charts.where(identifier: :actor_basic_attributes).any?
                return false
              end

              chart_node_types = profile.charts.first.chart_node_types
              destination_node_type =
                chart_node_types.find_by(identifier: 'destination')
              destination_node_type ? false : true
            end
          Api::V3::Readonly::NodeWithFlows.
            find_by(profile: invalid_profile.name)
        end

        it 'do not update actor_basic_attributes' do
          expect(node_with_flows.actor_basic_attributes).to be_nil

          node_with_flows.refresh_actor_basic_attributes
          node_with_flows.reload

          expect(node_with_flows.actor_basic_attributes).to be_nil
        end
      end

      context 'when it is possible to update actor_basic_attributes' do
        let!(:node_with_flows) do
          valid_profile =
            api_v3_brazil_soy_context.profiles.where(name: :actor).find do |profile|
              unless profile.charts.where(identifier: :actor_basic_attributes).any?
                return false
              end

              chart_node_types = profile.charts.first.chart_node_types
              destination_node_type =
                chart_node_types.find_by(identifier: 'destination')
              destination_node_type ? true : false
            end
          Api::V3::Readonly::NodeWithFlows.
            find_by(profile: valid_profile.name)
        end

        it 'update actor_basic_attributes' do
          expect(node_with_flows.actor_basic_attributes).to be_nil

          node_with_flows.refresh_actor_basic_attributes
          node_with_flows.reload

          expect(node_with_flows.actor_basic_attributes).not_to be_nil
        end
      end
    end
  end
end
