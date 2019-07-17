require 'rails_helper'

RSpec.describe Api::V3::Actors::BasicAttributes do
  include_context 'api v3 brazil exporter actor profile'
  include_context 'api v3 brazil importer actor profile'
  include_context 'api v3 brazil exporter quant values'
  include_context 'api v3 brazil importer quant values'
  include_context 'api v3 brazil flows quants'
  include_context 'api v3 paraguay exporter actor charts'
  include_context 'api v3 paraguay exporter quant values'
  include_context 'api v3 paraguay profiles'
  include_context 'api v3 paraguay flows quants'

  describe :call do
    before(:each) do
      Api::V3::Readonly::Node.refresh(sync: true)
      Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
      Api::V3::Readonly::ChartAttribute.refresh(sync: true, skip_dependencies: true)
    end
    let!(:brazil_exporter_attributes) { Api::V3::Actors::BasicAttributes.new(api_v3_context, api_v3_exporter1_node, 2015) }
    let!(:brazil_importer_attributes) { Api::V3::Actors::BasicAttributes.new(api_v3_context, api_v3_importer1_node, 2015) }
    let!(:paraguay_exporter_attributes) { Api::V3::Actors::BasicAttributes.new(api_v3_paraguay_context, api_v3_paraguay_exporter_node, 2015) }

    it 'check header parameters' do
      attrs = paraguay_exporter_attributes.call
      expect(attrs['zero_deforestation']).not_to eql nil
    end

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
      ).to include('or <span class="notranslate">100%</span> of the soy production municipalities')
    end

    context 'when difference in production from last year' do
      let(:flow) {
        FactoryBot.create(
          :api_v3_flow,
          context: api_v3_context,
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
  end
end
