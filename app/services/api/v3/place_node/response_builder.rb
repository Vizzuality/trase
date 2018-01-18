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
          top_nodes_list = Api::V3::PlaceNode::TopNodesList.new(
            @context, @year, @node
          )
          top_consumer_actors = top_nodes_list.
            call(NodeTypeName::EXPORTER, true)
          top_consumer_countries = top_nodes_list.
            call(NodeTypeName::COUNTRY, true)
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
            merge(top_consumer_actors: top_consumer_actors).
            merge(top_consumer_countries: top_consumer_countries).
            merge(indicators: indicators).
            merge(trajectory_deforestation: trajectory_deforestation)
        end
      end
    end
  end
end
