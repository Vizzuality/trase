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
          intialize_dictionaries
          @volume_attribute = Quant.find_by_name('Volume')
          @soy_production_attribute = Quant.find_by_name('SOY_TN')
          exporter_top_nodes = Api::V3::PlaceNode::TopNodesList.new(
            @context, @year, @node,
            other_node_type_name: NodeTypeName::EXPORTER,
            place_inds: @place_inds,
            place_quants: @place_quants
          )
          top_exporters_list = exporter_top_nodes.sorted_list(
            @volume_attribute, false, 10
          )
          top_exporters_with_domestic_list = exporter_top_nodes.sorted_list(
            @volume_attribute, true, 10
          )
          total_exports = exporter_top_nodes.total(@volume_attribute, false)
          total_exports_with_domestic = exporter_top_nodes.total(@volume_attribute, true)
          consumer_top_nodes = Api::V3::PlaceNode::TopNodesList.new(
            @context, @year, @node,
            other_node_type_name: NodeTypeName::COUNTRY,
            place_inds: @place_inds,
            place_quants: @place_quants
          )
          top_consumers_with_domestic_list = consumer_top_nodes.sorted_list(
            @volume_attribute, true, 10
          )
          total_consumption_with_domestic = consumer_top_nodes.total(@volume_attribute, true)
          @basic_attributes = Api::V3::PlaceNode::BasicAttributes.new(
            @context, @year, @node,
            place_inds: @place_inds,
            place_quants: @place_quants,
            soy_production_attribute: @soy_production_attribute,
            top_exporters: top_exporters_list,
            total_exports: total_exports,
            top_consumers: top_consumers_with_domestic_list
          )
          top_nodes_summary = Api::V3::PlaceNode::TopNodesSummary.new(
            @context, @year, @node,
            place_inds: @place_inds,
            place_quants: @place_quants,
            volume_attribute: @volume_attribute
          )
          @top_traders = top_nodes_summary.
            call(:actors, NodeTypeName::EXPORTER, top_exporters_with_domestic_list, total_exports_with_domestic, true)
          @top_consumers = top_nodes_summary.
            call(:countries, NodeTypeName::COUNTRY, top_consumers_with_domestic_list, total_consumption_with_domestic, true)
          @indicators = Api::V3::PlaceNode::IndicatorsTable.new(
            @context, @year, @node,
            place_inds: @place_inds,
            place_quants: @place_quants,
            state_name: @basic_attributes.state_name
          ).call
          @trajectory_deforestation =
            if municipality?
              Api::V3::PlaceNode::TrajectoryDeforestationPlot.new(
                @context, @year, @node,
                state_name: @basic_attributes.state_name
              ).call
            end
          self
        end

        private

        def intialize_dictionaries
          @place_quants = Hash[
            (@node.place_quants + @node.temporal_place_quants(@year)).map do |e|
              [e['name'], e]
            end
          ]
          @place_inds = Hash[
            (@node.place_inds + @node.temporal_place_inds(@year)).map do |e|
              [e['name'], e]
            end
          ]
        end
      end
    end
  end
end
