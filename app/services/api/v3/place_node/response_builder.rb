module Api
  module V3
    module PlaceNode
      class ResponseBuilder
        include ActiveModel::Serialization
        attr_reader :errors, :top_traders, :top_consumers, :indicators,
                    :trajectory_deforestation
        delegate :column_name, :country_name, :country_geo_id, :summary,
                 :municipality?, :municipality_name, :municipality_geo_id,
                 :logistics_hub?, :logistics_hub_name, :logistics_hub_geo_id,
                 :state?, :state_name, :state_geo_id,
                 :biome?, :biome_name, :biome_geo_id,
                 :area, :soy_production, :soy_area, :soy_farmland,
                 to: :@basic_attributes

        def initialize(context, node, year)
          @context = context
          @node = node
          @year = year
          @errors = []
        end

        def call
          @basic_attributes = Api::V3::PlaceNode::BasicAttributes.new(
            @context, @year, @node
          )
          top_nodes_summary = Api::V3::PlaceNode::TopNodesSummary.new(
            @context, @year, @node
          )
          @top_traders = top_nodes_summary.
            call(:actors, NodeTypeName::EXPORTER, true)
          @top_consumers = top_nodes_summary.
            call(:countries, NodeTypeName::COUNTRY, true)
          @indicators = Api::V3::PlaceNode::IndicatorsTable.new(
            @context, @year, @node
          ).call
          @trajectory_deforestation =
            if municipality?
              Api::V3::PlaceNode::TrajectoryDeforestationPlot.new(
                @context, @year, @node
              ).call
            end
          self
        end
      end
    end
  end
end
