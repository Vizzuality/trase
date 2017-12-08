module Api
  module V3
    module PlaceNode
      class BasicAttributes
        attr_reader :column_name, :country_name, :country_geo_id,
                    :municipality_name, :municipality_geo_id,
                    :logistics_hub_name, :logistics_hub_geo_id,
                    :state_name, :state_geo_id,
                    :biome_name, :biome_geo_id,
                    :area, :soy_production, :soy_farmland

        def initialize(context, year, node, data)
          @context = context
          @year = year
          @node = node
          @place_inds = data[:place_inds]
          @place_quants = data[:place_quants]
          @soy_production_attribute = data[:soy_production_attribute]
          @top_exporters = data[:top_exporters]
          @total_exports = data[:total_exports]
          @top_consumers = data[:top_consumers]

          @node_type_name = @node&.node_type&.name
          @column_name = @node_type_name
          @country_name = @context&.country&.name
          @country_geo_id = @context&.country&.iso2

          if municipality? || logistics_hub?
            initialize_municipality_and_logistics_hub_attributes
          end
          initialize_dynamic_attributes
        end

        NodeType::PLACES.each do |place_name|
          define_method("#{place_name.split.join('_').downcase}?") do
            @node_type_name == place_name
          end
        end

        def soy_area
          @soy_area_formatted
        end

        def summary
          return nil unless municipality? || logistics_hub?

          result = "In #{@year}, #{@node.name.titleize} produced \
#{@soy_production_formatted} #{@soy_production_unit} of soy occupying a total \
of #{@soy_area_formatted} #{@soy_area_unit} of land."
          result << summary_of_production_ranking
          result << summary_of_top_exporter_and_top_consumer
          result
        end

        private

        def initialize_dynamic_attributes
          @dynamic_attributes = {}
          @dynamic_attributes[
            (@node_type_name.split.join('_').downcase + '_name').to_sym
          ] = @node.name
          @dynamic_attributes[
            (@node_type_name.split.join('_').downcase + '_geo_id').to_sym
          ] = @node.geo_id
          @dynamic_attributes.each do |name, value|
            instance_variable_set("@#{name}", value)
          end
        end

        def initialize_municipality_and_logistics_hub_attributes
          @place_quals = Hash[
            (@node.place_quals + @node.temporal_place_quals(@year)).map do |e|
              [e['name'], e]
            end
          ]
          @biome_name = @place_quals[NodeTypeName::BIOME] &&
            @place_quals[NodeTypeName::BIOME]['value']
          @biome = Api::V3::Node.biomes.find_by_name(biome_name)
          @biome_geo_id = @biome&.geo_id
          @state_name = @place_quals[NodeTypeName::STATE] &&
            @place_quals[NodeTypeName::STATE]['value']
          @state = Api::V3::Node.states.find_by_name(state_name)
          @state_geo_id = @state&.geo_id
          initialize_soy_attributes
        end

        def initialize_soy_attributes
          if @place_quants['AREA_KM2'].present?
            @area = @place_quants['AREA_KM2']['value']
          end
          if @place_quants['SOY_TN'].present?
            @soy_production = @place_quants['SOY_TN']['value']
            @soy_production_formatted = helper.number_with_precision(
              @soy_production, delimiter: ',', precision: 0
            )
            @soy_production_unit = @place_quants['SOY_TN']['unit']
          end
          if @place_inds['SOY_YIELD'].present?
            @soy_yield = @place_inds['SOY_YIELD']['value']
          end
          if @soy_production && @soy_yield
            @soy_area_formatted = helper.number_with_precision(
              @soy_production / @soy_yield,
              delimiter: ',', precision: 0
            )
            @soy_area_unit = 'Ha' # soy prod in Tn, soy yield in Tn/Ha
          end
          return unless @place_inds['SOY_AREAPERC'].present?
          @soy_farmland = @place_inds['SOY_AREAPERC']['value']
        end

        def summary_of_production_ranking
          total_soy_production = Api::V3::NodeQuant.
            where(quant_id: @soy_production_attribute.id, year: @year).
            sum(:value)

          percentage_total_production =
            if @soy_production
              helper.number_to_percentage(
                (@soy_production / total_soy_production) * 100,
                delimiter: ',', precision: 2
              )
            end
          country_ranking = CountryRanking.new(@context, @year, @node).
            position_for_attribute(@soy_production_attribute)
          if country_ranking.present?
            country_ranking = country_ranking.ordinalize
          end
          if @state.present?
            state_ranking = StateRanking.new(@context, @year, @node, @state.name).
              position_for_attribute(@soy_production_attribute)
          end
          state_ranking = state_ranking.ordinalize if state_ranking.present?
          state_name = @state.name.titleize if @state.present?

          " With #{percentage_total_production} of the total production, it \
ranks #{country_ranking} in Brazil in soy production, and #{state_ranking} in \
the state of #{state_name}."
        end

        def summary_of_top_exporter_and_top_consumer
          top_exporter = @top_exporters.first
          if top_exporter.present?
            top_exporter_name = top_exporter['name']&.titleize
            if @total_exports.present?
              percentage_total_exports = helper.number_to_percentage(
                ((top_exporter[:value] || 0) / @total_exports) * 100,
                delimiter: ',', precision: 1
              )
            end
          end

          top_consumer = @top_consumers.first
          top_consumer_name = top_consumer['name']&.titleize if top_consumer

          if top_exporter && percentage_total_exports && top_consumer
            " The largest exporter of soy in #{@node.name.titleize} \
was #{top_exporter_name}, which accounted for #{percentage_total_exports} of \
the total exports, and the main destination was #{top_consumer_name}."
          else
            ''
          end
        end

        def helper
          @helper ||= Class.new do
            include ActionView::Helpers::NumberHelper
          end.new
        end
      end
    end
  end
end
