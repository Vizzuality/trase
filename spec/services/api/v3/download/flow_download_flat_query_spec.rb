require 'rails_helper'

RSpec.describe Api::V3::Download::FlowDownloadFlatQuery do
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

  let(:flat_query) {
    query_builder.flat_query
  }

  describe :all do
    it 'returns DEFORESTATION as value of INDICATOR column' do
      results = flat_query.all
      deforestation = results.find { |r| r['INDICATOR'] == 'DEFORESTATION' }
      expect(deforestation['TOTAL']).to eq('10')
    end
  end

  describe :total do
    it 'returns count of flows per year' do
      expect(flat_query.total).to eq(4)
    end
  end
end
