require 'rails_helper'

RSpec.describe Api::V3::SankeyCardLink, type: :model do
  include_context 'api v3 brazil flows'
  include_context 'api v3 brazil beef nodes'
  include_context 'api v3 brazil flows quals'
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
    let(:sankey_card_link_without_title) {
      FactoryBot.build(:api_v3_sankey_card_link, title: nil)
    }

    it 'fails when host blank' do
      expect(sankey_card_link_without_host).to have(1).errors_on(:host)
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
          sankey_card_link.update_attributes(
            link_param: 'http://test.com?selectedYears%5B%5D=2009'
          )
          expect(sankey_card_link.host).to eql 'test.com'
          expect(sankey_card_link.query_params).to eql(
            'selectedYears' => ['2009']
          )
        end
      end

      describe '#extract_relations' do
        it 'extract relations from the params' do
          sankey_card_link.update_attributes(
            link_param: "http://test.com?selectedCommodityId=#{api_v3_beef.id}&"\
                        "selectedCountryId=#{api_v3_brazil.id}&"\
                        "selectedResizeBy=#{api_v3_volume.readonly_attribute.id}&"\
                        "selectedRecolorBy=#{api_v3_biome.readonly_attribute.id}&"\
                        'selectedYears%5B%5D=2015&selectedYears%5B%5D=2017&'\
                        "selectedBiomeFilterName=#{api_v3_biome_node.name}"
          )

          expect(sankey_card_link.host).to eql 'test.com'
          expect(sankey_card_link.commodity_id).to eql api_v3_beef.id
          expect(sankey_card_link.country_id).to eql api_v3_brazil.id
          expect(sankey_card_link.cont_attribute_id).to eql api_v3_volume.readonly_attribute.id
          expect(sankey_card_link.ncont_attribute_id).to eql api_v3_biome.readonly_attribute.id
          expect(sankey_card_link.start_year).to eql 2015
          expect(sankey_card_link.end_year).to eql 2017
          expect(sankey_card_link.biome_id).to eql api_v3_biome_node.id
        end
      end
    end

    describe 'after_commit' do
      describe '#add_nodes_relations' do
        it 'extract new nodes relations' do
          expect do
            sankey_card_link.update_attributes(
              link_param: "#{sankey_card_link.link}&" \
                          "selectedNodesIds%5B%5D=#{api_v3_brazil_beef_country_of_production_node.id}&" \
                          "selectedNodesIds%5B%5D=#{api_v3_country_of_destination_node.id}"
            )
          end.to change { Api::V3::SankeyCardLinkNode.count }.by(2)
        end

        it 'removes old nodes relations' do
          base_link = sankey_card_link.link
          sankey_card_link.update_attributes(
            link_param: "#{base_link}&"\
                        "selectedNodesIds%5B%5D=#{api_v3_brazil_beef_country_of_production_node.id}&"\
                        "selectedNodesIds%5B%5D=#{api_v3_country_of_destination_node.id}"
          )

          expect do
            sankey_card_link.update_attributes(
              link_param: "#{base_link}&"\
                          "selectedNodesIds%5B%5D=#{api_v3_brazil_beef_country_of_production_node.id}"
            )
          end.to change { Api::V3::SankeyCardLinkNode.count }.by(-1)
        end
      end

      describe '#add_node_types_relations' do
        it 'extract new node types relations' do
          expect do
            column_id = api_v3_brazil_beef_port_of_export_context_node_type.
              node_type_id
            sankey_card_link.update_attributes(
              link_param: "#{sankey_card_link.link}&" \
                          "selectedColumnsIds=1_#{column_id}"
            )
          end.to change { Api::V3::SankeyCardLinkNodeType.count }.by(1)
        end

        it 'removes old nodes relations' do
          base_link = sankey_card_link.link
          column_id = api_v3_brazil_beef_port_of_export_context_node_type.
            node_type_id
          sankey_card_link.update_attributes(
            link_param: "#{base_link}&"\
                        "selectedColumnsIds=1_#{column_id}"
          )

          expect do
            sankey_card_link.update_attributes(
              link_param: "#{base_link}&selectedColumnsIds="
            )
          end.to change { Api::V3::SankeyCardLinkNodeType.count }.by(-1)
        end
      end
    end
  end
end
