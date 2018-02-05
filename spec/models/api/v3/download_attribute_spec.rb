require 'rails_helper'

RSpec.describe Api::V3::DownloadAttribute, type: :model do
  include_context 'api v3 brazil download attributes'

  describe :validate do
    let(:attribute_without_context) {
      FactoryBot.build(:api_v3_download_attribute, context: nil)
    }
    let(:duplicate) {
      FactoryBot.build(
        :api_v3_download_attribute,
        context: api_v3_context,
        position: api_v3_deforestation_v2_download_attribute.position
      )
    }
    it 'fails when context missing' do
      expect(attribute_without_context).to have(1).errors_on(:context)
    end
    it 'fails when context + position taken' do
      expect(duplicate).to have(1).errors_on(:position)
    end
  end
end
