require "rails_helper"

RSpec.describe Api::V3::Download::Parameters do
  let(:context) { FactoryBot.create(:api_v3_context) }

  describe :precompute? do
    context "when filters present" do
      let(:subject) {
        Api::V3::Download::Parameters.new(context, years: [2019])
      }
      it "is false" do
        expect(subject.precompute?).to be(false)
      end
    end
    context "when no filters present and pivot" do
      let(:subject) {
        Api::V3::Download::Parameters.new(context, pivot: true)
      }
      it "is true" do
        expect(subject.precompute?).to be(true)
      end
    end
    context "when no filters present and no pivot" do
      let(:subject) {
        Api::V3::Download::Parameters.new(context, {})
      }
      it "is true" do
        expect(subject.precompute?).to be(true)
      end
    end
  end
end
