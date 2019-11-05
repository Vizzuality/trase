module Api
  module V3
    module SankeyCardLinks
      class ResponseBuilder
        attr_reader :data, :meta

        def initialize(params)
          initialize_params(params)
        end

        def call
          initialize_sankey_card_links

          initialize_data
          initialize_meta
        end

        private

        def initialize_params(params)
          @level = (params[:level] || '').split(',')
          @country_id = params[:country_id]
          @commodity_id = params[:commodity_id]
        end

        def initialize_sankey_card_links
          query = Api::V3::SankeyCardLink.all
          @level.each { |level| query = query.where("level#{level}": true) }
          query = query.where(country_id: @country_id) if @country_id
          query = query.where(commodity_id: @commodity_id) if @commodity_id
          @sankey_card_links = query
        end

        def initialize_data
          @data = ActiveModelSerializers::SerializableResource.new(
            @sankey_card_links,
            each_serializer: Api::V3::SankeyCardLinks::SankeyCardLinkSerializer,
            root: 'data'
          ).serializable_hash[:data]
        end

        def initialize_meta
          @meta = {}

          sankey_card_link_nodes_ids =
            @sankey_card_links.map(&:sankey_card_link_node_ids).flatten.uniq
          sankey_card_link_nodes =
            Api::V3::SankeyCardLinkNode.where(id: sankey_card_link_nodes_ids)
          @meta[:nodes] = ActiveModelSerializers::SerializableResource.new(
            sankey_card_link_nodes,
            each_serializer: Api::V3::SankeyCardLinks::NodeSerializer,
            root: 'nodes'
          ).serializable_hash[:nodes].uniq

          sankey_card_link_node_type_ids =
            @sankey_card_links.map(&:sankey_card_link_node_type_ids).flatten.uniq
          sankey_card_link_node_types = Api::V3::SankeyCardLinkNodeType.
            where(id: sankey_card_link_node_type_ids)
          columns = ActiveModelSerializers::SerializableResource.new(
            sankey_card_link_node_types,
            each_serializer: Api::V3::SankeyCardLinks::ColumnSerializer,
            root: 'columns'
          ).serializable_hash[:columns]
          @meta[:columns] = {}
          columns.each { |col| @meta[:columns][col[:nodeTypeId]] = col }
        end
      end
    end
  end
end
