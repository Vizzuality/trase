module Api
  module V3
    module Actors
      class TopCountries
        # @param context [Api::V3::Context]
        # @param node [Api::V3::Node]
        # @year [Integer]
        def initialize(context, node, year)
          @top_nodes_summary = Api::V3::Actors::TopNodesSummary.new(
            context, node, year
          )
        end

        # Top nodes (destinations) linked to this actor node across years
        def call
          @top_nodes_summary.call(
            NodeTypeName::COUNTRY
          )
        end
      end
    end
  end
end
