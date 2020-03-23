require 'rails_helper'
require 'models/api/v3/shared_attributes_examples'

RSpec.describe Api::V3::ChartAttribute, type: :model do
  include_context 'api v3 brazil municipality place profile'
  include_context 'api v3 brazil municipality place profile'
  include_context 'api v3 brazil context node types'
  include_context 'api v3 brazil soy profiles'
  include_context 'api v3 brazil exporter actor profile'
  include_context 'api v3 brazil importer actor profile'
  include_context 'api v3 brazil exporter quant values'
  include_context 'api v3 brazil exporter qual values'
  include_context 'api v3 brazil exporter ind values'
  include_context 'api v3 brazil importer quant values'
  include_context 'api v3 brazil flows quants'

  before do
    Api::V3::Readonly::CommodityAttributeProperty.refresh
    Api::V3::Readonly::CountryAttributeProperty.refresh
    Api::V3::Readonly::ContextAttributeProperty.refresh
    Api::V3::Readonly::FlowNode.refresh(sync: true)
    Api::V3::Readonly::NodeWithFlowsPerYear.refresh(sync: true)
    Api::V3::Readonly::NodeWithFlows.refresh(sync: true)
    Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
    Api::V3::Readonly::ChartAttribute.refresh(sync: true, skip_dependencies: true)
    Api::V3::ChartAttribute.set_callback(:commit, :after, :refresh_dependencies)
  end

  after do
    Api::V3::ChartAttribute.skip_callback(:commit, :after, :refresh_dependencies)
  end

  describe :validate do
    let(:chart_attribute_without_chart) {
      FactoryBot.build(:api_v3_chart_attribute, chart: nil)
    }
    let(:duplicate_on_position) {
      FactoryBot.build(
        :api_v3_chart_attribute,
        chart: api_v3_place_trajectory_deforestation,
        identifier: nil,
        position: api_v3_place_trajectory_deforestation_deforestation_v2.position
      )
    }
    let(:non_duplicate_on_position) {
      FactoryBot.build(
        :api_v3_chart_attribute,
        chart: api_v3_place_basic_attributes,
        identifier: api_v3_place_basic_attributes_commodity_area.identifier + 'zonk',
        position: nil
      )
    }
    let(:duplicate_on_identifier) {
      FactoryBot.build(
        :api_v3_chart_attribute,
        chart: api_v3_place_basic_attributes,
        identifier: api_v3_place_basic_attributes_commodity_area.identifier,
        position: nil
      )
    }
    let(:non_duplicate_on_identifier) {
      FactoryBot.build(
        :api_v3_chart_attribute,
        chart: api_v3_place_trajectory_deforestation,
        identifier: '',
        position: api_v3_place_trajectory_deforestation_deforestation_v2.position + 1
      )
    }
    let(:duplicate_on_quant) do
      chart_attribute = FactoryBot.build(
        :api_v3_chart_attribute,
        chart: api_v3_place_trajectory_deforestation,
        identifier: nil,
        position: api_v3_place_trajectory_deforestation_deforestation_v2.position + 1,
        state_average: false
      )
      FactoryBot.build(
        :api_v3_chart_quant,
        chart_attribute: chart_attribute,
        quant: api_v3_deforestation_v2
      )
      chart_attribute
    end
    let(:state_average_variant) do
      chart_attribute = FactoryBot.create(
        :api_v3_chart_attribute,
        chart: api_v3_place_trajectory_deforestation,
        identifier: nil,
        position: api_v3_place_trajectory_deforestation_deforestation_v2.position + 1,
        state_average: true
      )
      FactoryBot.create(
        :api_v3_chart_quant,
        chart_attribute: chart_attribute,
        quant: api_v3_deforestation_v2
      )
      chart_attribute
    end
    it 'fails when chart missing' do
      expect(chart_attribute_without_chart).to have(1).error_on(:chart)
    end
    it 'fails when chart + position duplicate' do
      expect(duplicate_on_position).to have(1).errors_on(:position)
    end
    it 'is successful when chart + empty position duplicate' do
      expect(non_duplicate_on_position).to have(0).errors_on(:position)
      expect { non_duplicate_on_position.save! }.not_to raise_error
    end
    it 'fails when chart + identifier duplicate' do
      expect(duplicate_on_identifier).to have(1).errors_on(:identifier)
    end
    it 'is successful when chart + empty identifier duplicate' do
      expect(non_duplicate_on_identifier).to have(0).errors_on(:identifier)
      expect { non_duplicate_on_identifier.save! }.not_to raise_error
    end
    it 'fails when same attribute associated more than once' do
      duplicate_on_quant.valid?
      expect(duplicate_on_quant).to have(1).errors_on(:base)
    end
    it 'is successful when same attribute associated as state average' do
      expect(state_average_variant).to have(0).errors_on(:base)
    end
    it 'saves empty identifier as NULL' do
      attribute = FactoryBot.create(:api_v3_chart_attribute, identifier: '')
      expect(attribute.identifier).to be_nil
    end
  end

  describe :destroy_zombies do
    let!(:referenced) { FactoryBot.create(:api_v3_chart_attribute) }
    let!(:chart_ind) {
      FactoryBot.create(
        :api_v3_chart_ind,
        chart_attribute: referenced,
        ind: FactoryBot.create(:api_v3_ind)
      )
    }
    let!(:zombie) { FactoryBot.create(:api_v3_chart_attribute) }
    let(:subject) { Api::V3::ChartAttribute }
    include_examples 'destroys zombies'
  end

  describe :hooks do
    describe :after_commit do
      describe :refresh_actor_basic_attributes do
        let!(:profile) { api_v3_context.profiles.find_by(name: :actor) }
        let!(:chart) do
          profile.charts.where(identifier: :actor_basic_attributes).first
        end
        let!(:chart_attribute) do
          chart.chart_attributes.find_by(identifier: 'zero_deforestation')
        end
        let!(:related_node_with_flows) do
          context_node_type = Api::V3::ContextNodeType.find(
            chart_attribute.chart.profile.context_node_type_id
          )
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
            chart_attribute.update_attributes(identifier: 'new identifier')

            related_node_with_flows.each do |node_with_flows|
              expect(node_with_flows.actor_basic_attributes).to be_nil
            end
          end
        end

        context 'when chart_id changes' do
          it 'refresh actor_basic_attributes of the related node_with_flows' do
            chart_attribute.update_attributes(chart_id: Api::V3::Chart.last.id)

            related_node_with_flows.each do |node_with_flows|
              expect(node_with_flows.actor_basic_attributes).to be_nil
            end

            context_node_type = Api::V3::ContextNodeType.find(
              Api::V3::Chart.last.profile.context_node_type_id
            )
            context = context_node_type.context
            nodes = context_node_type.node_type.nodes
            new_related_node_with_flows = Api::V3::Readonly::NodeWithFlows.where(
              context_id: context.id,
              id: nodes.map(&:id)
            )

            new_related_node_with_flows.each do |node_with_flows|
              expect(node_with_flows.actor_basic_attributes).not_to be_nil
            end
          end
        end

        context 'when changes any other field' do
          it 'not refresh actor_basic_attributes of the related node_with_flows' do
            chart_attribute.update_attributes(identifier: 'new identifier')

            related_node_with_flows.each do |node_with_flows|
              expect(node_with_flows.actor_basic_attributes).to be_nil
            end
          end
        end
      end
    end
  end
end
