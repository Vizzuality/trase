require 'rails_helper'

RSpec.describe Api::V3::Profile, type: :model do
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
  end

  describe :validate do
    let(:profile_without_context_node_type) {
      FactoryBot.build(
        :api_v3_profile, context_node_type: nil
      )
    }
    let(:duplicate) {
      FactoryBot.build(
        :api_v3_profile,
        context_node_type: api_v3_exporter1_context_node,
        name: 'actor'
      )
    }
    it 'fails when context node type missing' do
      expect(profile_without_context_node_type).to have(2).
        errors_on(:context_node_type)
    end
    it 'fails when context node type taken' do
      expect(duplicate).to have(1).errors_on(:name)
    end
  end

  describe :hooks do
    describe :after_commit do
      describe :refresh_actor_basic_attributes do
        let!(:profile) { api_v3_context.profiles.find_by(name: :actor) }
        let!(:related_node_with_flows) do
          context_node_type =
            Api::V3::ContextNodeType.find(profile.context_node_type_id)
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

        context 'when the name changes' do
          it 'refresh actor_basic_attributes of the related node_with_flows' do
            profile.update_attributes(name: 'place')

            related_node_with_flows.each do |node_with_flows|
              expect(node_with_flows.actor_basic_attributes).to be_nil
            end
          end
        end

        context 'when context_node_type_id changes' do
          it 'refresh actor_basic_attributes of the related node_with_flows' do
            profile.update_attributes(
              context_node_type_id: Api::V3::ContextNodeType.last.id
            )

            related_node_with_flows.each do |node_with_flows|
              node_with_flows.reload
              expect(node_with_flows.actor_basic_attributes).to be_nil
            end
          end
        end

        context 'when changes any other field' do
          it 'not refresh actor_basic_attributes of the related node_with_flows' do
            profile.update_attributes(adm_1_name: 'new_name')

            related_node_with_flows.each do |node_with_flows|
              expect(node_with_flows.actor_basic_attributes).to be_nil
            end
          end
        end
      end
    end
  end
end
