# rubocop:disable Metrics/ClassLength
module Api
  module V3
    module Places
      class BasicAttributes
        include Api::V3::Profiles::AttributesInitializer

        # @param context [Api::V3::Context]
        # @param node [Api::V3::Node]
        # @param year [Integer]
        def initialize(context, node, year)
          @context = context
          @node = node
          @year = year
          @node_type_name = @node&.node_type&.name
          @place_quals = Dictionary::PlaceQuals.new(@node, @year)
          @place_quants = Dictionary::PlaceQuants.new(@node, @year)
          @place_inds = Dictionary::PlaceInds.new(@node, @year)
          quant_dictionary = Dictionary::Quant.instance
          # Assumption: Volume is a special quant which always exists
          @volume_attribute = quant_dictionary.get('Volume')
          raise 'Quant Volume not found' unless @volume_attribute.present?

          initialize_chart_configuration
        end

        def call
          @attributes = {
            column_name: @node_type_name,
            country_name: @context&.country&.name,
            country_geo_id: @context&.country&.iso2
          }

          @attributes = @attributes.merge initialize_ancestors

          if summary_enabled?
            @attributes = @attributes.merge(
              initialize_commodity_attributes
            )
          end
          @attributes = @attributes.merge initialize_dynamic_attributes
          initialize_top_nodes
          @attributes[:summary] = summary
          @attributes
        end

        def summary_enabled?
          @summary_node_types.map(&:name).include?(@node_type_name)
        end

        def summary
          return nil unless summary_enabled?

          if @commodity_production.zero?
            return "<span class=\"notranslate\">#{@node.name.titleize}</span> \
did not produce any soy in \
<span class=\"notranslate\">#{@year}</span>."
          end

          result = "In <span class=\"notranslate\">#{@year}</span>, \
<span class=\"notranslate\">#{@node.name.titleize}</span> produced \
<span class=\"notranslate\">#{@commodity_production_formatted}</span> \
<span class=\"notranslate\">#{@commodity_production_unit}</span> of \
<span class=\"notranslate\">#{@context.commodity.name.downcase}</span> \
occupying a total of \
<span class=\"notranslate\">#{@commodity_area_formatted}</span> \
<span class=\"notranslate\">#{@commodity_area_unit}</span> of land."
          result << summary_of_production_ranking
          result << summary_of_top_exporter_and_top_consumer
          result
        end

        private

        def initialize_chart_configuration
          initialize_chart_config(:place, nil, :place_basic_attributes)
          @summary_node_types = @chart_config.named_node_types('summary')
          raise "No summary node types found" unless @summary_node_types.any?

          %w(
            commodity_production commodity_yield commodity_farmland area
          ).each do |attribute_name|
            attribute = @chart_config.named_attribute(attribute_name)
            raise "#{attribute_name} attribute not found" unless attribute

            instance_variable_set("@#{attribute_name}_attribute", attribute)
          end

          top_countries_chart_config =
            Api::V3::Profiles::ChartConfiguration.new(
              @context,
              @node,
              profile_type: :place,
              parent_identifier: nil,
              identifier: :place_top_consumer_countries
            )
          @destination_node_type = top_countries_chart_config.
            named_node_type('destination')
          unless @destination_node_type
            raise 'Chart node type "destination" not found (top countries)'
          end

          top_traders_chart_config = Api::V3::Profiles::ChartConfiguration.new(
            @context,
            @node,
            profile_type: :place,
            parent_identifier: nil,
            identifier: :place_top_consumer_actors
          )
          @trader_node_type = top_traders_chart_config.
            named_node_type('trader')
          unless @trader_node_type
            raise 'Chart node type "trader" not found (top traders)'
          end
        end

        def initialize_dynamic_attributes
          dynamic_attributes = {}
          node_type_name_us = @node_type_name.split.join('_').downcase
          dynamic_attributes[
            (node_type_name_us + '_name').to_sym
          ] = @node.name
          dynamic_attributes[
            (node_type_name_us + '_geo_id').to_sym
          ] = @node.geo_id
          dynamic_attributes
        end

        # this assumes a lot:
        # - place context node types are in group 0
        # - only considers is_geo_column ones
        # - looks for value of a qual with node type name
        def initialize_ancestors
          attributes = {}
          place_context_node_types = @context.context_node_types.
            includes(:node_type).
            joins(:context_node_type_property).
            where(
              'context_node_type_properties.column_group' => 0,
              'context_node_type_properties.is_geo_column' => true
            )
          place_node_types = place_context_node_types.map(&:node_type)
          place_node_types.each do |node_type|
            node_type_name = node_type.name
            node_type_name_lc = node_type_name.downcase
            qual = @place_quals.get(node_type_name)
            node_name = qual && qual['value']
            node_type_name_plural = node_type_name&.underscore&.pluralize
            next unless node_name &&
              Api::V3::Node.respond_to?(node_type_name_plural)

            node = Api::V3::Node.send(node_type_name_plural).
              find_by_name(node_name)
            instance_variable_set("@#{node_type_name_lc}", node) # TODO
            attributes[:"#{node_type_name_lc}_name"] = node_name
            attributes[:"#{node_type_name_lc}_geo_id"] = node.geo_id if node
          end
          attributes
        end

        def attribute_value(attribute)
          return nil unless attribute

          values_store =
            case attribute.simple_type
            when 'ind'
              @place_inds
            when 'qual'
              @place_quals
            else
              @place_quants
            end
          values_store.get(attribute.name)
        end

        def initialize_area
          area_attribute_value = attribute_value(@area_attribute)
          return unless area_attribute_value

          @area = area_attribute_value['value']
        end

        def initialize_commodity_production
          commodity_production_attribute_value = attribute_value(
            @commodity_production_attribute
          )
          return unless commodity_production_attribute_value

          @commodity_production = commodity_production_attribute_value['value']
          @commodity_production_formatted = helper.number_with_precision(
            @commodity_production, delimiter: ',', precision: 0
          )
          @commodity_production_unit =
            commodity_production_attribute_value['unit']
        end

        def initialize_commodity_yield
          commodity_yield_attribute_value = attribute_value(
            @commodity_yield_attribute
          )
          return unless commodity_yield_attribute_value

          @commodity_yield = commodity_yield_attribute_value['value']
        end

        def initialize_commodity_area
          return unless @commodity_production && @commodity_yield

          @commodity_area_formatted = helper.number_with_precision(
            @commodity_production / @commodity_yield,
            delimiter: ',', precision: 0
          )
          @commodity_area_unit = 'ha' # soy prod in Tn, soy yield in Tn/Ha
        end

        def initialize_commodity_farmland
          commodity_farmland_attribute_value = attribute_value(
            @commodity_farmland_attribute
          )
          return unless commodity_farmland_attribute_value

          @commodity_farmland = commodity_farmland_attribute_value['value']
        end

        def initialize_commodity_attributes
          commodity_attributes = {}
          initialize_area
          commodity_attributes[:area] = @area if @area
          initialize_commodity_production
          if @commodity_production
            commodity_attributes[:soy_production] = @commodity_production
          end
          initialize_commodity_yield
          initialize_commodity_area
          if @commodity_area_formatted
            commodity_attributes[:soy_area] = @commodity_area_formatted
          end
          if @commodity_farmland
            commodity_attributes[:soy_farmland] = @commodity_farmland
          end
          commodity_attributes
        end

        def initialize_top_nodes
          exporter_top_nodes = Api::V3::Profiles::TopNodesList.new(
            @context,
            @node,
            year_start: @year,
            year_end: @year,
            other_node_type_name: @trader_node_type.name
          )
          consumer_top_nodes = Api::V3::Profiles::TopNodesList.new(
            @context,
            @node,
            year_start: @year,
            year_end: @year,
            other_node_type_name: @destination_node_type.name
          )
          @top_exporters = exporter_top_nodes.sorted_list(
            @volume_attribute,
            include_domestic_consumption: false,
            limit: 10
          )
          @total_exports = exporter_top_nodes.total(
            @volume_attribute,
            include_domestic_consumption: false
          )
          @top_consumers = consumer_top_nodes.sorted_list(
            @volume_attribute,
            include_domestic_consumption: true,
            limit: 10
          )
        end

        def summary_of_production_ranking
          total_soy_production = Api::V3::NodeQuant.
            where(quant_id: @commodity_production_attribute.id, year: @year).
            sum(:value)

          percentage_total_production =
            if @commodity_production && total_soy_production.positive?
              helper.number_to_percentage(
                (@commodity_production / total_soy_production) * 100,
                delimiter: ',', precision: 2
              )
            end
          country_ranking = CountryRanking.new(@context, @node, @year).
            position_for_attribute(@commodity_production_attribute)
          if country_ranking.present?
            country_ranking = country_ranking.ordinalize
          end
          if @state.present?
            state_ranking = StateRanking.
              new(@context, @node, @year, @state.name).
              position_for_attribute(@commodity_production_attribute)
            state_name = @state.name.titleize
          end
          state_ranking = state_ranking.ordinalize if state_ranking.present?

          text =
            if percentage_total_production == '0.00%'
              ' With less than 0.01% '
            else
              " With #{percentage_total_production} "
            end

          text + "of the total production, it \
ranks <span class=\"notranslate\">#{country_ranking}</span> in \
<span class=\"notranslate\">#{@context.country.name.capitalize}</span> \
in \
<span class=\"notranslate\">#{@context.commodity.name.downcase}</span> \
production, and \
<span class=\"notranslate\">#{state_ranking}</span> in \
the state of <span class=\"notranslate\">#{state_name}</span>."
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
            " The largest exporter of soy in \
<span class=\"notranslate\">#{@node.name.titleize}</span> was \
<span class=\"notranslate\">#{top_exporter_name}</span>, which accounted for \
<span class=\"notranslate\">#{percentage_total_exports}</span> of \
the total exports, and the main destination was \
<span class=\"notranslate\">#{top_consumer_name}</span>."
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
# rubocop:enable Metrics/ClassLength
