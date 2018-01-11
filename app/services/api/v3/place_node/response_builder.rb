module Api
  module V3
    module PlaceNode
      class ResponseBuilder
        include ActiveModel::Serialization

        def initialize(context, node, year)
          @context = context
          @node = node
          @year = year
        end

        def call
          @basic_attributes = Api::V3::PlaceNode::BasicAttributes.new(
            @context, @year, @node
          )
          top_nodes_summary = Api::V3::PlaceNode::TopNodesSummary.new(
            @context, @year, @node
          )
          top_traders = top_nodes_summary.
            call(:actors, NodeTypeName::EXPORTER, true)
          top_consumers = top_nodes_summary.
            call(:countries, NodeTypeName::COUNTRY, true)
          indicators = Api::V3::PlaceNode::IndicatorsTable.new(
            @context, @year, @node
          ).call
          trajectory_deforestation =
            if @basic_attributes.municipality?
              Api::V3::PlaceNode::TrajectoryDeforestationPlot.new(
                @context, @year, @node
              ).call
            end

          @basic_attributes.attributes.
            merge(top_traders: top_traders).
            merge(top_consumers: top_consumers).
            merge(indicators: indicators).
            merge(trajectory_deforestation: trajectory_deforestation)
        end
      end
    end
  end
end
