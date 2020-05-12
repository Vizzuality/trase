require 'rails_helper'

RSpec.describe Api::V3::ContextNodeTypeProperty, type: :model do
  include_context 'api v3 brazil context node types'

  describe :validate do
    let(:property_without_context_node_type) {
      FactoryBot.build(
        :api_v3_context_node_type_property, context_node_type: nil
      )
    }
    let(:duplicate) {
      FactoryBot.build(
        :api_v3_context_node_type_property,
        context_node_type: api_v3_biome_context_node
      )
    }
    let(:property_without_prefix) {
      FactoryBot.build(
        :api_v3_context_node_type_property, role: :exporter, prefix: nil
      )
    }
    let(:context_node_type_from_another_context) {
      cnt = FactoryBot.create(:api_v3_context_node_type)
      FactoryBot.create(
        :api_v3_context_node_type_property,
        context_node_type: cnt,
        is_geo_column: true
      )
      cnt
    }

    let(:property_with_invalid_geometry_context_node_type_1) {
      FactoryBot.build(
        :api_v3_context_node_type_property,
        context_node_type: api_v3_logistics_hub_context_node,
        geometry_context_node_type: context_node_type_from_another_context
      )
    }
    let(:property_with_invalid_geometry_context_node_type_2) {
      FactoryBot.build(
        :api_v3_context_node_type_property,
        context_node_type: api_v3_biome_context_node,
        geometry_context_node_type: api_v3_exporter1_context_node
      )
    }
    it 'fails when context node type missing' do
      expect(property_without_context_node_type).to have(2).
        errors_on(:context_node_type)
    end
    it 'fails when context node type taken' do
      expect(duplicate).to have(1).errors_on(:context_node_type)
    end
    it 'fails when prefix missing' do
      expect(property_without_prefix).to have(1).
        errors_on(:prefix)
    end
    it 'fails when geometry_context_node_type from different context' do
      expect(property_with_invalid_geometry_context_node_type_1).to have(1).
        errors_on(:geometry_context_node_type_id)
    end
    it 'fails when geometry_context_node_type not geo column' do
      expect(property_with_invalid_geometry_context_node_type_2).to have(1).
        errors_on(:geometry_context_node_type_id)
    end
  end

  describe :create do
    include_context 'api v3 brazil soy flow quants'

    before(:each) {
      cnt_prop = api_v3_municipality_context_node.context_node_type_property
      @cnt_prop_attrs = cnt_prop.attributes
      cnt_prop.delete

      Api::V3::Readonly::FlowNode.refresh(
        sync: true, skip_dependents: true
      )
      Api::V3::Readonly::NodeWithFlowsPerYear.refresh(
        sync: true, skip_dependents: true
      )
      Api::V3::Readonly::NodesPerContextRankedByVolumePerYear.refresh(
        sync: true, skip_dependents: true
      )

      Api::V3::ContextNodeTypeProperty.set_callback(:create, :after, :refresh_dependents_after_create)
    }
    after(:each) {
      Api::V3::ContextNodeTypeProperty.skip_callback(:create, :after, :refresh_dependents_after_create)
    }

    context 'when created with source role' do
      let(:source_municipalities_cnt) {
        Api::V3::Readonly::NodeWithFlowsPerYear.where(
          node_type_id: api_v3_municipality_node_type.id,
          context_id: api_v3_brazil_soy_context.id
        ).select(:id).distinct.count
      }
      it 'dashboards_sources is refreshed' do
        expect do
          FactoryBot.create(
            :api_v3_context_node_type_property,
            @cnt_prop_attrs
          )
        end.to change(Api::V3::Readonly::Dashboards::Source, :count).by(
          source_municipalities_cnt
        )
      end

      it 'dashboards_exporters is not changed' do
        expect do
          FactoryBot.create(
            :api_v3_context_node_type_property,
            role: Api::V3::ContextNodeTypeProperty::SOURCE_ROLE
          )
        end.not_to change(Api::V3::Readonly::Dashboards::Exporter, :count)
      end
    end
  end

  describe :update do
    include_context 'api v3 brazil soy flow quants'

    before(:each) {
      Api::V3::Readonly::FlowNode.refresh(
        sync: true, skip_dependents: true
      )
      Api::V3::Readonly::NodeWithFlowsPerYear.refresh(
        sync: true, skip_dependents: true
      )
      Api::V3::Readonly::NodesPerContextRankedByVolumePerYear.refresh(
        sync: true, skip_dependents: true
      )
      Api::V3::Readonly::Dashboards::Source.refresh(
        sync: true, skip_dependents: true
      )

      Api::V3::ContextNodeTypeProperty.set_callback(:update, :after, :refresh_dependents_after_update)
    }
    after(:each) {
      Api::V3::ContextNodeTypeProperty.skip_callback(:update, :after, :refresh_dependents_after_update)
    }

    context 'when updated from source role to exporter' do
      let(:source_municipalities_cnt) {
        Api::V3::Readonly::NodeWithFlowsPerYear.where(
          node_type_id: api_v3_municipality_node_type.id,
          context_id: api_v3_brazil_soy_context.id
        ).select(:id).distinct.count
      }
      let!(:property) {
        api_v3_municipality_context_node.context_node_type_property
      }
      it 'dashboards_sources is refreshed' do
        expect do
          property.update(role: Api::V3::ContextNodeTypeProperty::EXPORTER_ROLE)
        end.to change(Api::V3::Readonly::Dashboards::Source, :count).by(
          -source_municipalities_cnt
        )
      end

      it 'dashboards_exporters is refreshed' do
        expect do
          property.update(role: Api::V3::ContextNodeTypeProperty::EXPORTER_ROLE)
        end.to change(Api::V3::Readonly::Dashboards::Exporter, :count).by(
          source_municipalities_cnt
        )
      end
    end
  end
end
