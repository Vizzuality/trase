require 'rails_helper'

RSpec.describe Api::V3::IsMviewPopulated do
  describe :call do
    let(:subject) { Api::V3::IsMviewPopulated.new(:nodes_mv) }
    it 'should return false when not populated' do
      expect(subject.call).to be false
    end

    it 'should return true when populated' do
      FactoryBot.create(:api_v3_node)
      Api::V3::Readonly::Node.refresh(sync: true)
      expect(subject.call).to be true
    end
  end
end
