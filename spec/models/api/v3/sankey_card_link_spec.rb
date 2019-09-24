require 'rails_helper'

RSpec.describe Api::V3::SankeyCardLink, type: :model do
  include_context 'api v3 brazil flows'
  include_context 'api v3 brazil resize by attributes'

  before do
    Api::V3::Readonly::Node.refresh(sync: true)
    Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
  end

  let(:sankey_card_link) {
    FactoryBot.build(:api_v3_sankey_card_link)
  }

  describe :validate do
    let(:sankey_card_link_without_host) {
      FactoryBot.build(:api_v3_sankey_card_link, host: nil)
    }
    let(:sankey_card_link_without_query_params) {
      FactoryBot.build(:api_v3_sankey_card_link, query_params: nil, link_param: 'http://test.com')
    }
    let(:sankey_card_link_without_title) {
      FactoryBot.build(:api_v3_sankey_card_link, title: nil)
    }
    let(:sankey_card_link_with_invalid_query_params) {
      FactoryBot.build(:api_v3_sankey_card_link, link_param: 'http://test.com?one=1')
    }
    let(:sankey_card_link_without_required_params) {
      FactoryBot.build(:api_v3_sankey_card_link, query_params: {commodity_id: 1})
    }

    it 'fails when host blank' do
      expect(sankey_card_link_without_host).to have(1).errors_on(:host)
    end

    it 'fails when query_params blank' do
      expect(sankey_card_link_without_query_params).to have(1).errors_on(:query_params)
    end

    it 'fails when query_params include invalid parameters' do
      expect(sankey_card_link_with_invalid_query_params).to have(2).errors_on(:link_param)
    end

    it 'fails when query_params doesnt include all required parameters' do
      expect(sankey_card_link_without_required_params).to have(1).errors_on(:link_param)
    end

    it 'fails when title blank' do
      expect(sankey_card_link_without_title).to have(1).errors_on(:title)
    end
  end

  describe :methods do
    describe '#link' do
      it 'return complete link' do
        expect(sankey_card_link.link).to eql(
          "http://#{sankey_card_link.host}?#{sankey_card_link.query_params.to_query}"
        )
      end
    end
  end

  describe :callbacks do
    describe 'before_validation' do
      describe '#extract_link_params' do
        it 'extract parameters from link' do
          sankey_card_link.update_attributes(link_param: 'http://test.com?start_year=1')
          expect(sankey_card_link.host).to eql 'test.com'
          expect(sankey_card_link.query_params).to eql({'start_year' => '1'})
        end
      end

      describe '#extract_required_params' do
        it 'extract relations from the required params' do
          sankey_card_link.update_attributes(link_param: 'http://test.com?commodity_id=1')
          expect(sankey_card_link.host).to eql 'test.com'
          expect(sankey_card_link.commodity_id).to eql 1
        end
      end
    end

    describe 'after_commit' do
      describe '#add_nodes_relations' do
        it 'extract new nodes relations' do
          expect do
            node = Api::V3::Node.first
            sankey_card_link.update_attributes(
              link_param: "#{sankey_card_link.link}&nodes_ids=#{node.id}"
            )
          end.to change { Api::V3::SankeyCardLinkNode.count }.by(1)
        end

        it 'removes old nodes relations' do
          base_link = sankey_card_link.link
          nodes = Api::V3::Node.all
          sankey_card_link.update_attributes(
            link_param: "#{base_link}&nodes_ids=#{nodes.first.id},#{nodes.second.id}"
          )

          expect do
            sankey_card_link.update_attributes(
              link_param: "#{base_link}&nodes_ids=#{nodes.first.id}"
            )
          end.to change { Api::V3::SankeyCardLinkNode.count }.by(-1)
        end
      end
    end
  end
end
