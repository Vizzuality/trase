require 'rails_helper'

RSpec.describe Api::V3::Context, type: :model do
  include_context 'api v3 brazil flows'

  describe :biome_nodes do
    context 'when context without biomes' do
      include_context 'api v3 brazil beef flows'

      let(:context) { api_v3_brazil_beef_context }

      it 'returns empty array' do
        expect(context.biome_nodes).to eq([])
      end
    end

    context 'when context with biomes' do
      include_context 'api v3 paraguay flows'

      let(:context) { api_v3_paraguay_context }

      it 'returns biome nodes' do
        expect(context.biome_nodes).to eq([api_v3_paraguay_biome_node])
      end
    end
  end
end
