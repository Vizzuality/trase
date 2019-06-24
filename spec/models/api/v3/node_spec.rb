require 'rails_helper'

RSpec.describe Api::V3::Node, type: :model do
  include_context 'api v3 brazil soy nodes'

  describe :place_nodes do
    let(:subject) { Api::V3::Node.place_nodes(api_v3_context) }
    it 'includes municipalities' do
      expect {
        subject.find(api_v3_municipality_node.id)
      }.not_to raise_error
    end
    it 'does not include exporters' do
      expect {
        subject.find(api_v3_exporter1_node.id)
      }.to raise_error(ActiveRecord::RecordNotFound)
    end
  end

  describe :actor_nodes do
    let(:subject) { Api::V3::Node.actor_nodes(api_v3_context) }
    it 'includes exporters' do
      expect {
        subject.find(api_v3_exporter1_node.id)
      }.not_to raise_error
    end
    it 'does not include municipalities' do
      expect {
        subject.find(api_v3_municipality_node.id)
      }.to raise_error(ActiveRecord::RecordNotFound)
    end
  end
end
