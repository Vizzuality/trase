RSpec.describe Api::V3::DatabaseChecks::ContextNodeTypeCheckChain do
  describe :chain do
    let(:context_node_type) {
      FactoryBot.create(:api_v3_context_node_type)
    }
    let(:errors_list) {
      Api::V3::DatabaseChecks::ErrorsList.new
    }
    let(:check_chain) {
      Api::V3::DatabaseChecks::ContextNodeTypeCheckChain.new(
        context_node_type, errors_list
      )
    }
    it 'returns expected validations' do
      expect(check_chain.chain).to include(
        Api::V3::DatabaseChecks::HasOneAssociationPresent
      )
    end
  end
end
