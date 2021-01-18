require 'rails_helper'

RSpec.describe Api::V3::Actors::BasicAttributes do
  include_context 'api v3 brazil exporter actor profile'
  include_context 'api v3 brazil importer actor profile'
  include_context 'api v3 brazil exporter quant values'
  include_context 'api v3 brazil exporter qual values'
  include_context 'api v3 brazil exporter ind values'
  include_context 'api v3 brazil importer quant values'
  include_context 'api v3 brazil soy flow quants'
  include_context 'api v3 paraguay exporter actor charts'
  include_context 'api v3 paraguay exporter quant values'
  include_context 'api v3 paraguay profiles'
  include_context 'api v3 paraguay flows quants'

  describe :call do
    before(:each) {
      Api::V3::Readonly::FlowNode.refresh(sync: true)
      Api::V3::Readonly::NodeWithFlowsPerYear.refresh(sync: true)
      Api::V3::Readonly::NodeWithFlows.refresh(sync: true)
      Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
    }

    let(:brazil_exporter_attributes) { Api::V3::Actors::BasicAttributes.new(api_v3_brazil_soy_context, api_v3_exporter1_node, 2015) }
    let(:brazil_importer_attributes) { Api::V3::Actors::BasicAttributes.new(api_v3_brazil_soy_context, api_v3_importer1_node, 2015) }
    let(:paraguay_exporter_attributes) { Api::V3::Actors::BasicAttributes.new(api_v3_paraguay_context, api_v3_paraguay_exporter_node, 2015) }

    it 'uses context specific quant values for production percentage calculation' do
      brazil_exporter_values = brazil_exporter_attributes.call
      brazil_importer_values = brazil_exporter_attributes.call
      paraguay_exporter_values = paraguay_exporter_attributes.call

      expect(
        brazil_exporter_values[:summary]
      ).to_not include('or of the soy production')

      expect(
        brazil_exporter_values[:summary]
      ).to include('or <span class="notranslate">100%</span> of the soy production municipalities')

      expect(
        brazil_importer_values[:summary]
      ).to_not include('or of the soy production')

      expect(
        brazil_importer_values[:summary]
      ).to include('or <span class="notranslate">100%</span> of the soy production municipalities')

      expect(
        paraguay_exporter_values[:summary]
      ).to_not include('or of the soy production')

      expect(
        paraguay_exporter_values[:summary]
      ).to include('or <span class="notranslate">100%</span> of the soy production departments')
    end

    context 'when difference in production from last year' do
      let(:flow) {
        FactoryBot.create(
          :api_v3_flow,
          context: api_v3_brazil_soy_context,
          path: [
            api_v3_biome_node,
            api_v3_state_node,
            api_v3_municipality_node,
            api_v3_logistics_hub_node,
            api_v3_port1_node,
            api_v3_exporter1_node,
            api_v3_importer1_node,
            api_v3_country_of_destination1_node
          ].map(&:id),
          year: 2014
        )
      }
      it 'calculates increase from last year' do
        FactoryBot.create(
          :api_v3_flow_quant,
          flow: flow,
          quant: api_v3_volume,
          value: 25
        )
        brazil_exporter_values = brazil_exporter_attributes.call
        expect(
          brazil_exporter_values[:summary]
        ).to include('<span class="notranslate">200%</span> increase')
      end
      it 'calculates decrease from last year' do
        FactoryBot.create(
          :api_v3_flow_quant,
          flow: flow,
          quant: api_v3_volume,
          value: 150
        )
        brazil_exporter_values = brazil_exporter_attributes.call
        expect(
          brazil_exporter_values[:summary]
        ).to include('<span class="notranslate">50%</span> decrease')
      end
      it 'calculates no change' do
        FactoryBot.create(
          :api_v3_flow_quant,
          flow: flow,
          quant: api_v3_volume,
          value: 75
        )
        brazil_exporter_values = brazil_exporter_attributes.call
        expect(
          brazil_exporter_values[:summary]
        ).to include('no change from')
      end
    end

    describe 'header parameters' do
      let!(:attrs) { brazil_exporter_attributes.call }
      let!(:header_attributes) { attrs[:header_attributes] }
      let!(:chart_attributes) {
        api_v3_exporter_basic_attributes.readonly_chart_attributes
      }

      it 'check header zero deforestation parameters' do
        zero_deforestation =
          chart_attributes.find_by(identifier: 'zero_deforestation')
        expect(attrs[:zero_deforestation]).not_to eql nil

        expect(header_attributes[:zero_deforestation][:value]).to eql(
          attrs[:zero_deforestation]
        )
        expect(header_attributes[:zero_deforestation][:name]).to eql(
          api_v3_exporter_basic_attributes_zero_deforestation_property.display_name
        )
        expect(header_attributes[:zero_deforestation][:unit]).to eql nil #Qual
        expect(header_attributes[:zero_deforestation][:tooltip]).to eql(
          api_v3_exporter_basic_attributes_zero_deforestation_property.tooltip_text
        )
      end

      it 'check header forest 500 parameters' do
        forest_500 = chart_attributes.find_by(identifier: 'forest_500')
        expect(attrs[:forest_500]).not_to eql nil
        expect(header_attributes[:forest_500][:name]).to eql(
          api_v3_exporter_basic_attributes_forest_500_property.display_name
        )
        expect(header_attributes[:forest_500][:unit]).to eql(forest_500.unit)
        expect(header_attributes[:forest_500][:tooltip]).to eql(
          api_v3_exporter_basic_attributes_forest_500_property.tooltip_text
        )
      end
    end
  end
end
