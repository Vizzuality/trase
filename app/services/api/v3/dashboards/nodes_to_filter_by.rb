module Api
  module V3
    module Dashboards
      class NodesToFilterBy
        WHITELISTED_KEYS = [
          :sources_ids,
          :companies_ids,
          :exporters_ids,
          :importers_ids,
          :destinations_ids
        ].freeze

        attr_reader :keys, :node_types_ids, :nodes

        # @param node_filters [Hash]
        # @option node_filters [Array<Integer>] sources_ids
        # @option node_filters [Array<Integer>] companies_ids
        # @option node_filters [Array<Integer>] exporters_ids
        # @option node_filters [Array<Integer>] importers_ids
        # @option node_filters [Array<Integer>] destinations_ids
        def initialize(node_filters)
          @keys = node_filters.compact.keys & WHITELISTED_KEYS
          @node_filters = node_filters.slice(*@keys)

          initialize_nodes
          initialize_nodes_by_key
          initialize_nodes_by_node_type_id
        end

        def nodes_by_key(key)
          @nodes_by_key[key]
        end

        def nodes_by_node_type_id(node_type_id)
          @nodes_by_node_type_id[node_type_id]
        end

        private

        def initialize_nodes
          nodes_ids = []
          @keys.each do |key|
            nodes_ids += @node_filters[key]
          end
          @nodes = Api::V3::Node.find(nodes_ids)
        end

        def initialize_nodes_by_key
          @nodes_by_key = Hash[
            @keys.map do |key|
              [
                key,
                @nodes.select { |node| @node_filters[key].include?(node.id) }
              ]
            end
          ]
        end

        def initialize_nodes_by_node_type_id
          @nodes_by_node_type_id = @nodes.group_by(&:node_type_id)
          @node_types_ids = @nodes.map(&:node_type_id).uniq
        end
      end
    end
  end
end
