require 'rails_helper'

RSpec.describe Api::V3::Chart, type: :model do
  include_context 'api v3 brazil municipality place profile'
  include_context 'api v3 brazil context node types'
  include_context 'api v3 brazil soy profiles'
  include_context 'api v3 brazil exporter actor profile'
  include_context 'api v3 brazil importer actor profile'
  include_context 'api v3 brazil exporter quant values'
  include_context 'api v3 brazil exporter qual values'
  include_context 'api v3 brazil exporter ind values'
  include_context 'api v3 brazil importer quant values'
  include_context 'api v3 brazil soy flow quants'

  before do
    Api::V3::Readonly::FlowNode.refresh(sync: true)
    Api::V3::Readonly::NodeWithFlowsPerYear.refresh(sync: true)
    Api::V3::Readonly::NodeWithFlows.refresh(sync: true)
    Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
    Api::V3::Chart.set_callback(:commit, :after, :refresh_dependents)
  end

  after do
    Api::V3::Chart.skip_callback(:commit, :after, :refresh_dependents)
  end

  describe :validate do
    let(:chart_without_profile) {
      FactoryBot.build(:api_v3_chart, profile: nil)
    }
    let(:chart_with_parent_from_different_profile) {
      FactoryBot.build(
        :api_v3_chart,
        parent: api_v3_place_trajectory_deforestation
      )
    }
    let(:chart_with_parent_is_not_root) {
      FactoryBot.build(
        :api_v3_chart,
        profile: api_v3_brazil_municipality_place_profile,
        parent: api_v3_place_environmental_indicators
      )
    }
    let(:duplicate) {
      FactoryBot.build(
        :api_v3_chart,
        profile: api_v3_brazil_municipality_place_profile,
        identifier: :place_trajectory_deforestation,
        position: 1
      )
    }
    it 'fails when profile missing' do
      expect(chart_without_profile).to have(1).error_on(:profile)
    end
    it 'fails when profile + identifier taken' do
      expect(duplicate).to have(1).errors_on(:identifier)
    end
    it 'fails when parent from another profile' do
      expect(
        chart_with_parent_from_different_profile
      ).to have(1).error_on(:parent)
    end
    it 'fails when parent is not root' do
      expect(chart_with_parent_is_not_root).to have(1).error_on(:parent)
    end
  end

  describe :chart_type do
    include_context 'api v3 brazil municipality place profile'
    include_context 'api v3 brazil exporter actor profile'
    it 'is line_chart_with_map for actor_top_countries' do
      expect(api_v3_exporter_top_countries.chart_type).to eq(:line_chart_with_map)
    end

    it 'is tabs_table for place_indicators' do
      expect(api_v3_place_indicators.chart_type).to eq(:tabs_table)
    end

    it 'is scatterplot for actor_exporting_companies' do
      expect(api_v3_exporter_exporting_companies.chart_type).to eq(:scatterplot)
    end

    it 'is stacked_line_chart for place_trajectory_deforestation' do
      expect(api_v3_place_trajectory_deforestation.chart_type).to eq(:stacked_line_chart)
    end

    it 'is sankey for place_top_consumer_actors' do
      expect(api_v3_place_top_consumer_actors.chart_type).to eq(:sankey)
    end

    it 'is null for actor_basic_attributes' do
      expect(api_v3_exporter_basic_attributes.chart_type).to be_nil
    end
  end

  describe :hooks do
    describe :after_commit do
      describe :refresh_actor_basic_attributes do
        let!(:profile) { api_v3_brazil_soy_context.profiles.find_by(name: :actor) }
        let!(:chart) do
          profile.charts.where(identifier: :actor_basic_attributes).first
        end
        let!(:related_node_with_flows) do
          context_node_type =
            Api::V3::ContextNodeType.find(chart.profile.context_node_type_id)
          context = context_node_type.context
          nodes = context_node_type.node_type.nodes
          Api::V3::Readonly::NodeWithFlows.where(
            context_id: context.id,
            id: nodes.map(&:id)
          )
        end

        before do
          ActiveRecord::Base.connection.execute(
            "UPDATE nodes_with_flows
            SET actor_basic_attributes = null
            WHERE id IN(#{related_node_with_flows.map(&:id).join(',')})"
          )
        end

        context 'when the identifier changes' do
          it 'refresh actor_basic_attributes of the related node_with_flows' do
            chart.update_attributes(identifier: 'new name')

            related_node_with_flows.each do |node_with_flows|
              expect(node_with_flows.actor_basic_attributes).to be_nil
            end
          end
        end

        context 'when profile_id changes' do
          it 'refresh actor_basic_attributes of the related node_with_flows' do
            new_profile = Api::V3::Profile.where(name: :actor).last
            Api::V3::Chart.where(profile_id: new_profile.id).destroy_all
            chart.update_attributes(profile_id: new_profile.id)

            related_node_with_flows.each do |node_with_flows|
              expect(node_with_flows.actor_basic_attributes).to be_nil
            end

            context_node_type = Api::V3::ContextNodeType.find(
              new_profile.context_node_type_id
            )
            context = context_node_type.context
            nodes = context_node_type.node_type.nodes
            new_related_node_with_flows = Api::V3::Readonly::NodeWithFlows.where(
              context_id: context.id,
              id: nodes.map(&:id)
            )

            new_related_node_with_flows.each do |node_with_flows|
              node_with_flows.reload

              expect(node_with_flows.actor_basic_attributes).not_to be_nil
            end
          end
        end

        context 'when changes any other field' do
          it 'not refresh actor_basic_attributes of the related node_with_flows' do
            chart.update_attributes(title: 'new title')

            related_node_with_flows.each do |node_with_flows|
              expect(node_with_flows.actor_basic_attributes).to be_nil
            end
          end
        end
      end
    end
  end
end
