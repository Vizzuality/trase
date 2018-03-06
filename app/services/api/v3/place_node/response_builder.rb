# @deprecated This allows to serve a combined response for the place profile
# and will be retired when we amend front-end to use the split responses
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
          @basic_attributes = Api::V3::Places::BasicAttributes.new(
            @context, @node, @year
          )
          top_nodes_list = Api::V3::Places::MiniSankey.new(
            @context, @node, @year
          )
          top_consumer_actors = top_nodes_list.
            call(NodeTypeName::EXPORTER, true)
          top_consumer_countries = top_nodes_list.
            call(NodeTypeName::COUNTRY, true)
          indicators = Api::V3::Places::IndicatorsTable.new(
            @context, @node, @year
          ).call
          trajectory_deforestation =
            if @basic_attributes.municipality?
              Api::V3::Places::TrajectoryDeforestationPlot.new(
                @context, @node, @year
              ).call
            end

          @basic_attributes.call.
            merge(top_consumer_actors: top_consumer_actors).
            merge(top_consumer_countries: top_consumer_countries).
            merge(indicators: indicators).
            merge(trajectory_deforestation: trajectory_deforestation)
        end
      end
    end
  end
end
