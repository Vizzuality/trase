require 'rails_helper'

RSpec.describe Api::V3::IndContextProperty, type: :model do
  include_context 'api v3 inds'
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
  include_context 'api v3 brazil soy flow quants'

  before do
    Api::V3::Readonly::FlowNode.refresh(sync: true)
    Api::V3::Readonly::NodeWithFlowsPerYear.refresh(sync: true)
    Api::V3::Readonly::NodeWithFlows.refresh(sync: true)
    Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
    Api::V3::IndContextProperty.set_callback(:commit, :after, :refresh_dependents)
  end

  after do
    Api::V3::IndContextProperty.skip_callback(:commit, :after, :refresh_dependents)
  end

  describe :validate do
    let(:property_without_ind) do
      FactoryBot.build(:api_v3_ind_context_property, ind: nil)
    end

    let(:property_without_context) do
      FactoryBot.build(:api_v3_ind_context_property, context: nil)
    end

    let(:property_without_tooltip_text) do
      FactoryBot.build(:api_v3_ind_context_property, tooltip_text: nil)
    end

    it 'fails when ind missing' do
      expect(property_without_ind).to have(2).errors_on(:ind)
    end

    it 'fails when context missing' do
      expect(property_without_context).to have(2).errors_on(:context)
    end

    it 'fails when tooltip_text missing' do
      expect(property_without_tooltip_text).to have(1).errors_on(:tooltip_text)
    end
  end

  describe :hooks do
    describe :after_commit do
      describe :refresh_actor_basic_attributes do
        let!(:ind_context_property) do
          api_v3_exporter_basic_attributes_forest_500_property
        end
        let!(:related_node_with_flows) do
          ind = ind_context_property.ind
          node_inds = ind.node_inds
          nodes = node_inds.map(&:node)

          Api::V3::Readonly::NodeWithFlows.where(
            context_id: ind_context_property.context_id,
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

        context 'when the context_id changes' do
          it 'refresh actor_basic_attributes of the related node_with_flows' do
            ind_context_property.update_attributes(
              context_id: Api::V3::Context.last.id
            )

            related_node_with_flows.each do |node_with_flows|
              expect(node_with_flows.actor_basic_attributes).to be_nil
            end
          end
        end

        context 'when ind_id changes' do
          it 'refresh actor_basic_attributes of the related node_with_flows' do
            ind_context_property.update_attributes(ind_id: nil)

            related_node_with_flows.each do |node_with_flows|
              expect(node_with_flows.actor_basic_attributes).to be_nil
            end
          end
        end

        context 'when tooltip_text changes' do
          it 'refresh actor_basic_attributes of the related node_with_flows' do
            ind_context_property.update_attributes(tooltip_text: 'new tooltip')

            related_node_with_flows.each do |node_with_flows|
              node_with_flows.reload
              expect(node_with_flows.actor_basic_attributes).not_to be_nil
            end
          end
        end
      end
    end
  end
end
