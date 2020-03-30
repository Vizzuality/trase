module Api
  module V3
    module Profiles
      class CrossContextTopNodesChart
        include Api::V3::Profiles::AttributesInitializer

        NODE_TYPE_IDENTIFIERS = {
          'place' => {
            place_top_consumer_actors: 'trader',
            place_top_consumer_countries: 'destination'
          },
          'country' => {
            country_top_consumer_actors: 'trader',
            country_top_consumer_countries: 'destination'
          }
        }.freeze

        # @param contexts [Array<Api::V3::Context>]
        # @param node [Api::V3::Node]
        # @param year [Integer]
        # @param profile_options [Hash]
        # @option profile_options [String] profile_type
        # @option profile_options [String] chart_identifier
        def initialize(contexts, node, year, profile_options)
          # this is a bit of bandaid to support cross context charts
          # even though profile objects are linked to a single context
          # @contexts = all the contexts to get data from
          # @context = one of those contexts to get the profile from
          # TODO: this needs rethinking
          @contexts = contexts
          @node = node
          @year = year
          @context = @node.context

          profile_type = profile_options[:profile_type]
          chart_identifier = profile_options[:chart_identifier]
          node_type_identifier =
            NODE_TYPE_IDENTIFIERS[profile_type][chart_identifier]
          initialize_chart_config(profile_type, nil, chart_identifier)
          @top_node_type = @chart_config.named_node_type(node_type_identifier)
          unless @top_node_type
            raise ActiveRecord::RecordNotFound.new(
              "Chart node type \"#{node_type_identifier}\" not found"
            )
          end
          # Assumption: Volume is a special quant which always exists
          @volume_attribute = Dictionary::Quant.instance.get('Volume')
          unless @volume_attribute.present?
            raise ActiveRecord::RecordNotFound.new 'Quant Volume not found'
          end
        end

        def call
          initialize_top_nodes

          {
            name: @node.name,
            indicator: @volume_attribute.display_name,
            unit: @volume_attribute.unit,
            targetNodes: @top_nodes.map do |top_node|
              top_node_id = top_node['node_id']
              value = top_node['value']
              {
                id: top_node_id,
                geo_id: top_node['geo_id'],
                name: top_node['name'],
                height: value / @all_nodes_total,
                is_domestic_consumption: top_node['is_domestic_consumption'].
                  present?,
                value: value
              }
            end
          }
        end

        private

        def top_nodes_list
          return @top_nodes_list if defined? @top_nodes_list

          @top_nodes_list = Api::V3::Profiles::CrossContextTopNodesList.new(
            @contexts,
            @top_node_type,
            @node,
            year_start: @year,
            year_end: @year
          )
        end

        def initialize_top_nodes
          @top_nodes = top_nodes_list.sorted_list(
            @volume_attribute,
            include_domestic_consumption: true,
            limit: 10
          )
          @all_nodes_total = top_nodes_list.total(
            @volume_attribute,
            include_domestic_consumption: true
          )
        end
      end
    end
  end
end
