require 'rails_helper'

RSpec.describe Api::V3::Download::FlowDownloadPivotQuery do
  include_context 'api v3 brazil two flows'

  before(:each) do
    Api::V3::Readonly::DownloadFlow.refresh(sync: true)
  end

  let(:query) {
    Api::V3::Readonly::DownloadFlow.where(context_id: api_v3_context.id)
  }

  let(:pivot_query) {
    Api::V3::Download::FlowDownloadPivotQuery.new(api_v3_context, query)
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
