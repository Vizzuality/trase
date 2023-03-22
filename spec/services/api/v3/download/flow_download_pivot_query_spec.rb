require "rails_helper"

RSpec.describe Api::V3::Download::FlowDownloadPivotQuery do
  include_context "api v3 brazil two flows"

  before do
    allow(
      Api::V3::Download::PrecomputedDownload
    ).to receive(:refresh)
  end

  before(:each) do
    Api::V3::Readonly::Attribute.refresh(skip_dependencies: true, skip_dependents: true)
    Api::V3::TablePartitions::CreatePartitionsForDenormalisedFlowQuants.new.call
    Api::V3::TablePartitions::CreatePartitionsForDenormalisedFlowQuals.new.call
    Api::V3::Readonly::DownloadFlowsStats.refresh(skip_dependencies: true, skip_dependents: true)
  end

  let(:query_builder) {
    Api::V3::Download::FlowDownloadQueryBuilder.new(api_v3_brazil_soy_context, {})
  }

  let(:pivot_query) {
    query_builder.pivot_query
  }

  describe :all do
    it "returns DEFORESTATION as a column header" do
      results = pivot_query.all
      expect(results[0]["DEFORESTATION"]).to eq("10")
    end

    it "returns sum of quant values" do
      results = pivot_query.all
      expect(results[1]["DEFORESTATION"]).to eq("15")
    end

    it "returns sum of qual values" do
      results = pivot_query.all
      expect(results[1]["ZERO DEFORESTATION"]).to eq("yes")
    end
  end

  describe :total do
    it "returns count of flows" do
      expect(pivot_query.total).to eq(2)
    end
  end
end
