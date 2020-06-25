module Api
  module V3
    module Profiles
      class SingleContextTopNodesChart < CrossContextTopNodesChart
        # @param context [Api::V3::Context]
        # @param node [Api::V3::Node]
        # @param year [Integer]
        # @param profile_options [Hash]
        # @option profile_options [String] profile_type
        # @option profile_options [String] chart_identifier
        def initialize(context, node, year, profile_options)
          super([context], node, year, profile_options)
          @context = context
        end

        private

        def top_nodes_list
          return @top_nodes_list if defined? @top_nodes_list

          @top_nodes_list = Api::V3::Profiles::SingleContextTopNodesList.new(
            @context,
            @top_node_type,
            @node,
            year_start: @year,
            year_end: @year
          )
        end
      end
    end
  end
end
