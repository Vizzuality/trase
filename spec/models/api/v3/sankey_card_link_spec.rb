require 'rails_helper'

RSpec.describe Api::V3::SankeyCardLink, type: :model do
  include_context 'api v3 brazil flows'
  include_context 'api v3 brazil beef nodes'
  include_context 'api v3 brazil flows quals'
  include_context 'api v3 brazil resize by attributes'
  include_context 'api v3 brazil beef context node types'

  include_context 'api v3 paraguay flows'
  include_context 'api v3 paraguay soy nodes'
  include_context 'api v3 paraguay flows quals'
  include_context 'api v3 paraguay recolor by attributes'
  include_context 'api v3 paraguay context node types'

  before do
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
    let(:sankey_card_link_without_level) {
      FactoryBot.build(:api_v3_sankey_card_link, level3: nil)
    }

    it 'fails when host blank' do
      expect(sankey_card_link_without_host).to have(1).errors_on(:host)
    end

    it 'fails when title blank' do
      expect(sankey_card_link_without_title).to have(1).errors_on(:title)
    end

    Api::V3::SankeyCardLink::LEVELS.each do |n|
      it "fails when there is more than #{Api::V3::SankeyCardLink::MAX_PER_LEVEL} for level#{n}" do
        FactoryBot.create_list(:api_v3_sankey_card_link, 4, "level#{n}": true)

        sankey_card_link = FactoryBot.build(:api_v3_sankey_card_link, "level#{n}": true)
        expect(sankey_card_link).to have(1).errors_on(:"level#{n}")
      end
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
            link_param: "#{sankey_card_link.link}&selectedYears%5B%5D=2009"
          )
          expect(sankey_card_link.query_params).to include(
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
                        "extraColumnNodeId=#{api_v3_biome_node.id}"
          )

          expect(sankey_card_link.host).to eql 'test.com'
          expect(sankey_card_link.commodity_id).to eql api_v3_beef.id
          expect(sankey_card_link.country_id).to eql api_v3_brazil.id
          expect(sankey_card_link.cont_attribute_id).to eql api_v3_volume.readonly_attribute.id
          expect(sankey_card_link.ncont_attribute_id).to eql api_v3_biome.readonly_attribute.id
          expect(sankey_card_link.start_year).to eql 2015
          expect(sankey_card_link.end_year).to eql 2017
          expect(sankey_card_link.node_id).to eql api_v3_biome_node.id
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
          node_type_id = api_v3_brazil_beef_port_of_export_context_node_type.
            node_type_id
          expect do
            sankey_card_link.update_attributes(
              link_param: "#{sankey_card_link.link}&" \
                          "selectedColumnsIds=1_#{node_type_id}"
            )
          end.to change { Api::V3::SankeyCardLinkNodeType.count }.by(4)

          sankey_card_link_node_type = Api::V3::SankeyCardLinkNodeType.
            find_by(sankey_card_link_id: sankey_card_link.id, column_group: 1)
          expect(sankey_card_link_node_type.node_type_id).to eql node_type_id
        end

        it 'add default node types relations' do
          expect do
            sankey_card_link.save
          end.to change { Api::V3::SankeyCardLinkNodeType.count }.by(4)

          context_id = Api::V3::Context.find_by(
            country_id: sankey_card_link.country_id,
            commodity_id: sankey_card_link.commodity_id
          )

          [0, 1, 2, 3].each do |column_group|
            sankey_card_link_node_type = Api::V3::SankeyCardLinkNodeType.
              find_by(sankey_card_link_id: sankey_card_link.id,
                      column_group: column_group)

            node_type_id = Api::V3::ContextNodeType.
              select('node_type_id').
              joins('JOIN context_node_type_properties ON context_node_type_properties.context_node_type_id = context_node_types.id').
              find_by(
                'context_node_types.context_id': context_id,
                'context_node_type_properties.column_group': column_group,
                'context_node_type_properties.is_default': true
              )&.node_type_id

            expect(sankey_card_link_node_type.node_type_id).to eql node_type_id
          end
        end
      end

      describe '#update_query_params' do
        it 'update query_params when the relations change' do
          sankey_card_link.save

          sankey_card_link.update_attributes(
            country_id: api_v3_paraguay.id,
            commodity_id: api_v3_soy.id,
            node_id: api_v3_paraguay_biome_node.id,
            cont_attribute_id: api_v3_fob.readonly_attribute.id,
            ncont_attribute_id: api_v3_biome.readonly_attribute.id
          )

          expect(sankey_card_link.query_params['selectedCountryId']).to eql(
            api_v3_paraguay.id
          )
          expect(sankey_card_link.query_params['selectedCommodityId']).to eql(
            api_v3_soy.id
          )
          expect(sankey_card_link.query_params['extraColumnNodeId']).to eql(
            api_v3_paraguay_biome_node.id
          )
          expect(sankey_card_link.query_params['selectedResizeBy']).to eql(
            api_v3_fob.readonly_attribute.id
          )
          expect(sankey_card_link.query_params['selectedRecolorBy']).to eql(
            api_v3_biome.readonly_attribute.id
          )
        end
      end
    end
  end
end
