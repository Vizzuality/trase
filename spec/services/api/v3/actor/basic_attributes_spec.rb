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
    let(:brazil_exporter_attributes) { Api::V3::Actors::BasicAttributes.new(api_v3_context, api_v3_exporter1_node, 2015) }
    let(:brazil_importer_attributes) { Api::V3::Actors::BasicAttributes.new(api_v3_context, api_v3_importer1_node, 2015) }
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
      ).to include('or <span class="notranslate">100%</span> of the soy production municipalities')
    end
  end
end
