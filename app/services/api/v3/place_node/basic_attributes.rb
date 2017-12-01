module Api
  module V3
    module PlaceNode
      class BasicAttributes
        attr_reader :column_name, :country_name, :country_geo_id,
                    :dynamic_attributes

        def initialize(context, node, place_inds, place_quants)
          @context = context
          @node = node
          @place_inds = place_inds
          @place_quants = place_quants

          node_type_name = @node&.node_type&.name
          @column_name = node_type_name
          @country_name = @context&.country&.name
          @country_geo_id = @context&.country&.iso2

          @dynamic_attributes = {}
          @dynamic_attributes[
            (node_type_name.downcase + '_name').to_sym
          ] = @node.name
          @dynamic_attributes[
            (node_type_name.downcase + '_geo_id').to_sym
          ] = @node.geo_id

          if [
            NodeTypeName::MUNICIPALITY, NodeTypeName::LOGISTICS_HUB
          ].include? @node_type
            @dynamic_attributes = @dynamic_attributes.merge(
              municipality_and_logistics_hub_attributes
            )
          end
        end

        def summary
          soy_produced_raw, soy_produced = if (production = @place_quants['SOY_TN'])
                                             value = helper.number_with_precision(production['value'], delimiter: ',', precision: 0)
                                             unit = production['unit']
                                             [production['value'], "#{value} #{unit}"]
                                           end
          soy_area = if soy_produced_raw && @place_inds['SOY_YIELD'] && (soy_yield_raw = @place_inds['SOY_YIELD']['value'])
                       value = helper.number_with_precision(soy_produced_raw / soy_yield_raw, delimiter: ',', precision: 0)
                       unit = 'Ha' # soy prod in Tn, soy yield in Tn/Ha
                       "#{value} #{unit}"
                     end
          perc_total = total_soy_production
          percentage_total_production = if (perc = @place_quants['SOY_TN'])
                                          helper.number_to_percentage((perc['value'] / perc_total) * 100, delimiter: ',', precision: 2)
                                        end
          country_ranking = CountryRanking.new(@context, @year, @node).
            position_for_attribute('quant', 'SOY_TN')
          country_ranking = country_ranking.ordinalize if country_ranking.present?
          state_ranking = @stats.state_ranking(@state, 'quant', 'SOY_TN') if @state.present?
          state_ranking = state_ranking.ordinalize if state_ranking.present?

          largest_exporter = (traders = top_municipality_exporters) && traders[:actors][0]
          if largest_exporter.present?
            largest_exporter_name = largest_exporter[:name].try(:humanize)
            percent_of_exports = helper.number_to_percentage(
              (largest_exporter[:value] || 0) * 100,
              delimiter: ',', precision: 1
            )
          end

          main_destination = (consumers = @data[:top_consumers][:countries]) && consumers[0] && consumers[0][:name]
          main_destination = main_destination.humanize if main_destination.present?

          state_name = @state.name.titleize if @state.present?

          <<~SUMMARY
            In #{@year}, #{@node.name.titleize} produced #{soy_produced} of soy occupying a total of #{soy_area} \
            of land. With #{percentage_total_production} of the total production, it ranks #{country_ranking} in Brazil in soy \
            production, and #{state_ranking} in the state of #{state_name}. The largest exporter of soy \
            in #{@node.name.titleize} was #{largest_exporter_name}, which accounted for #{percent_of_exports} of the total exports, \
            and the main destination was #{main_destination}.
          SUMMARY
        end

        private

        def municipality_and_logistics_hub_attributes
          @place_quals = Hash[(@node.place_quals + @node.temporal_place_quals(@year)).map do |e|
            [e['name'], e]
          end]

          data = {}

          biome_name = @place_quals[NodeTypeName::BIOME] && @place_quals[NodeTypeName::BIOME]['value']
          @biome = Node.biomes.find_by_name(biome_name)
          data[:biome_name] = biome_name
          data[:biome_geo_id] = @biome&.geo_id
          state_name = @place_quals[NodeTypeName::STATE] && @place_quals[NodeTypeName::STATE]['value']
          @state = Node.states.find_by_name(state_name)
          data[:state_name] = state_name
          data[:state_geo_id] = @state&.geo_id
          if @place_quants['AREA_KM2'].present?
            data[:area] = @place_quants['AREA_KM2']['value']
          end
          if @place_quants['SOY_TN'].present?
            data[:soy_production] = @place_quants['SOY_TN']['value']
          end
          if data[:soy_production] && @place_inds['SOY_YIELD'] && (soy_yield_raw = @place_inds['SOY_YIELD']['value'])
            value = helper.number_with_precision(data[:soy_production] / soy_yield_raw, delimiter: ',', precision: 0)
            data[:soy_area] = value
          end
          if @place_inds['SOY_AREAPERC'].present?
            data[:soy_farmland] = @place_inds['SOY_AREAPERC']['value']
          end

          data
        end

        def total_soy_production
          NodeQuant.
            joins(:quant).
            where('quants.name' => 'SOY_TN', :year => 2015).
            sum(:value)
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
