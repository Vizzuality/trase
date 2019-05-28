require 'rails_helper'

RSpec.describe Api::V3::Download::FlowDownloadPivotQuery do
  include_context 'api v3 brazil two flows'

  before do
    allow(
      Api::V3::Download::PrecomputedDownload
    ).to receive(:refresh)
  end

  before(:each) do
    Api::V3::Readonly::DownloadFlow.refresh(sync: true)
  end

  let(:query_builder) {
    Api::V3::Download::FlowDownloadQueryBuilder.new(api_v3_context, {})
  }

  let(:pivot_query) {
    query_builder.pivot_query
  }

  describe :all do
    it 'returns DEFORESTATION as a column header' do
      results = pivot_query.all
      expect(results[0]['DEFORESTATION']).to eq('10')
    end
  end

  describe :total do
    it 'returns count of flows' do
      expect(pivot_query.total).to eq(2)
    end
  end
end
