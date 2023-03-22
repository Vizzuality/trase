RSpec.describe Api::V3::DatabaseValidation::Report do
  let(:report) {
    Api::V3::DatabaseValidation::Report.new
  }

  context "when configuration complete" do
    include_context "minimum complete configuration"

    describe :call do
      it "finds no errors" do
        expect(report.call).to be_empty
      end
    end
  end

  context "when configuration incomplete or incorrect" do
    let!(:context) { FactoryBot.create(:api_v3_context) }
    let!(:context_property) {
      tmp = FactoryBot.create(:api_v3_context_property, context: context)
      tmp.update_attribute(:default_basemap, :zonk) # skip validations
      tmp
    }
    let!(:qual) { FactoryBot.create(:api_v3_qual) }
    let!(:quant) { FactoryBot.create(:api_v3_quant) }
    let!(:ind) { FactoryBot.create(:api_v3_ind) }
    describe :call do
      it "finds errors" do
        expect(report.call).not_to be_empty
      end
    end
  end

  describe :human_readable_rules do
    it "returns an array" do
      expect(
        Api::V3::DatabaseValidation::Report.human_readable_rules
      ).to be_a(Array)
    end
  end
end
