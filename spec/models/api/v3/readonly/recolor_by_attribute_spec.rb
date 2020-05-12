require 'rails_helper'

RSpec.describe Api::V3::Readonly::RecolorByAttribute, type: :model do
  include_context 'api v3 brazil recolor by attributes'
  include_context 'api v3 paraguay recolor by attributes'
  include_context 'api v3 brazil soy flow quals'
  include_context 'api v3 paraguay flows quals'

  before(:each) do
    Api::V3::Readonly::FlowQualDistinctValues.refresh(sync: true, skip_dependents: true)
    Api::V3::Readonly::Attribute.refresh
  end

  describe :legend do
    context 'when Paraguay' do
      let(:recolor_by_attribute) {
        api_v3_paraguay_biome_recolor_by_attribute.readonly_recolor_by_attribute
      }

      it 'only returns Paraguay values' do
        expect(recolor_by_attribute.legend).to eq(['Chaco seco'])
      end
    end
  end
end
