RSpec.describe Api::V3::DatabaseChecks::ContextCheckChain do
  describe :chain do
    let(:context) {
      FactoryBot.create(:api_v3_context)
    }
    let(:errors_list) {
      Api::V3::DatabaseChecks::ErrorsList.new
    }
    let(:check_chain) {
      Api::V3::DatabaseChecks::ContextCheckChain.new(
        context, errors_list
      )
    }
    it 'returns expected validations' do
      expect(check_chain.chain).to include(
        Api::V3::DatabaseChecks::HasOneAssociationPresent
      )
    end
  end
end
