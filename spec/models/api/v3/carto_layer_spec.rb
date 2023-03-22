require "rails_helper"

RSpec.describe Api::V3::CartoLayer, type: :model do
  include_context "api v3 brazil contextual layers"

  describe :validate do
    let(:layer_without_contextual_layer) {
      FactoryBot.build(:api_v3_carto_layer, contextual_layer: nil)
    }
    let(:duplicate) {
      FactoryBot.build(
        :api_v3_carto_layer,
        contextual_layer: api_v3_contextual_layer_landcover,
        identifier: "landcover"
      )
    }
    it "fails when contextual layer missing" do
      expect(layer_without_contextual_layer).to have(2).errors_on(:contextual_layer)
    end
    it "fails when contextual_layer + identifier taken" do
      expect(duplicate).to have(1).errors_on(:identifier)
    end
  end
end
