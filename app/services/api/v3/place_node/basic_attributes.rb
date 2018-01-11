module Api
  module V3
    module PlaceNode
      class BasicAttributes
        attr_reader :attributes

        def initialize(context, year, node)
          @context = context
          @year = year
          @node = node
          @node_type_name = @node&.node_type&.name
          @place_quals = Dictionary::PlaceQuals.new(@node, @year)
          @place_quants = Dictionary::PlaceQuants.new(@node, @year)
          @place_inds = Dictionary::PlaceInds.new(@node, @year)
          @volume_attribute = Dictionary::Quant.instance.get('Volume')
          raise 'Quant Volume not found' unless @volume_attribute.present?
          @soy_production_attribute = Dictionary::Quant.instance.get('SOY_TN')
          raise 'Quant SOY_TN not found' unless @soy_production_attribute.present?

          @attributes = {
            column_name: @node_type_name,
            country_name: @context&.country&.name,
            country_geo_id: @context&.country&.iso2
          }

          if municipality? || logistics_hub?
            @attributes = @attributes.merge(
              initialize_municipality_and_logistics_hub_attributes
            ).merge(
              initialize_soy_attributes
            )
          end
          @attributes = @attributes.merge initialize_dynamic_attributes
          initialize_top_nodes
          @attributes[:summary] = summary
        end

        def municipality?
          @node_type_name == NodeTypeName::MUNICIPALITY
        end

        def logistics_hub?
          @node_type_name == NodeTypeName::LOGISTICS_HUB
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
          dynamic_attributes = {}
          dynamic_attributes[
            (@node_type_name.split.join('_').downcase + '_name').to_sym
          ] = @node.name
          dynamic_attributes[
            (@node_type_name.split.join('_').downcase + '_geo_id').to_sym
          ] = @node.geo_id
          dynamic_attributes
        end

        def initialize_municipality_and_logistics_hub_attributes
          attributes = {}
          biome_qual = @place_quals.get(NodeTypeName::BIOME)
          biome_name = biome_qual && biome_qual['value']
          if biome_name
            @biome = Api::V3::Node.biomes.find_by_name(biome_name)
            attributes[:biome_name] = biome_name
            attributes[:biome_geo_id] = @biome.geo_id if @biome
          end
          state_qual = @place_quals.get(NodeTypeName::STATE)
          state_name = state_qual && state_qual['value']
          if state_name
            @state = Api::V3::Node.states.find_by_name(state_name)
            attributes[:state_name] = state_name
            attributes[:state_geo_id] = @state.geo_id if @state
          end
          attributes
        end

        def initialize_soy_attributes
          soy_attributes = {}
          area_quant = @place_quants.get('AREA_KM2')
          soy_attributes[:area] = area_quant['value'] if area_quant
          soy_production_quant = @place_quants.get('SOY_TN')
          if soy_production_quant
            @soy_production = soy_production_quant['value']
            @soy_production_formatted = helper.number_with_precision(
              @soy_production, delimiter: ',', precision: 0
            )
            @soy_production_unit = soy_production_quant['unit']
            soy_attributes[:soy_production] = @soy_production
          end
          soy_yield_ind = @place_inds.get('SOY_YIELD')
          @soy_yield = soy_yield_ind['value'] if soy_yield_ind
          if @soy_production && @soy_yield
            @soy_area_formatted = helper.number_with_precision(
              @soy_production / @soy_yield,
              delimiter: ',', precision: 0
            )
            @soy_area_unit = 'Ha' # soy prod in Tn, soy yield in Tn/Ha
            soy_attributes[:soy_area] = @soy_area_formatted
          end
          soy_farmland_ind = @place_inds.get('SOY_AREAPERC')
          if soy_farmland_ind
            soy_attributes[:soy_farmland] = soy_farmland_ind['value']
          end
          soy_attributes
        end

        def initialize_top_nodes
          exporter_top_nodes = Api::V3::Profiles::TopNodesList.new(
            @context, @year, @node,
            other_node_type_name: NodeTypeName::EXPORTER
          )
          consumer_top_nodes = Api::V3::Profiles::TopNodesList.new(
            @context, @year, @node,
            other_node_type_name: NodeTypeName::COUNTRY
          )
          @top_exporters = exporter_top_nodes.sorted_list(
            @volume_attribute, false, 10
          )
          @total_exports = exporter_top_nodes.total(@volume_attribute, false)
          @top_consumers = consumer_top_nodes.sorted_list(
            @volume_attribute, true, 10
          )
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
