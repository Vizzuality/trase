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
        # @option profile_options [Boolean] include_other
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
          @include_other = profile_options[:include_other]
        end

        def call
          initialize_top_nodes
          target_nodes = target_nodes_formatted

          target_nodes << other_node_formatted if @include_other

          {
            name: @node.name,
            indicator: @volume_attribute.display_name,
            unit: @volume_attribute.unit,
            targetNodes: target_nodes
          }
        end

        private

        def target_nodes_formatted
          @top_nodes.map do |top_node|
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
        end

        def other_node_formatted
          other_value = @all_nodes_total - @target_nodes_total
          {
            id: 0,
            geo_id: 'XX',
            name: 'OTHER',
            height: @all_nodes_total.zero? ? 0 : other_value / @all_nodes_total,
            is_domestic_consumption: nil,
            value: other_value
          }
        end

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
          @target_nodes_total = @top_nodes.inject(0) { |sum, node| sum + node[:value] }
        end
      end
    end
  end
end
