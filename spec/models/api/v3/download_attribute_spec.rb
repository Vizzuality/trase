require "rails_helper"
require "models/api/v3/shared_attributes_examples"

RSpec.describe Api::V3::DownloadAttribute, type: :model do
  include_context "api v3 brazil download attributes"

  describe :validate do
    let(:attribute_without_context) {
      FactoryBot.build(:api_v3_download_attribute, context: nil)
    }
    it "fails when context missing" do
      expect(attribute_without_context).to have(2).errors_on(:context)
    end
  end

  describe :destroy_zombies do
    let!(:referenced) { FactoryBot.create(:api_v3_download_attribute) }
    let!(:download_quant) {
      FactoryBot.create(
        :api_v3_download_quant,
        download_attribute: referenced,
        quant: FactoryBot.create(:api_v3_quant)
      )
    }
    let!(:zombie) { FactoryBot.create(:api_v3_download_attribute) }
    let(:subject) { Api::V3::DownloadAttribute }
    include_examples "destroys zombies"
  end
end
