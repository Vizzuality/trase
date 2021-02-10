module Api
  module V3
    module Places
      class BasicAttributes
        include ActiveSupport::Configurable
        include Api::V3::Profiles::AttributesInitializer

        config_accessor :get_name_and_tooltip do
          Api::V3::AttributeNameAndTooltip
        end

        # @param context [Api::V3::Context]
        # @param node [Api::V3::Readonly::NodeWithFlows]
        # @param year [Integer]
        def initialize(context, node, year)
          @context = context
          @node = node
          @year = year
          @node_type_name = @node.node_type
          quant_dictionary = Dictionary::Quant.instance
          # Assumption: Volume is a special quant which always exists
          @volume_attribute = quant_dictionary.get('Volume')
          unless @volume_attribute.present?
            raise ActiveRecord::RecordNotFound.new 'Quant Volume not found'
          end

          @values = Api::V3::NodeAttributeValuesPreloader.new(@node, @year)
          initialize_chart_configuration
        end

        def call
          @attributes = {
            column_name: @node_type_name,
            country_name: @context&.country&.name,
            country_geo_id: @context&.country&.iso2,
            jurisdiction_name: @node.name,
            jurisdiction_geo_id: @node.geo_id
          }

          @attributes = @attributes.merge initialize_ancestors
          @attributes = @attributes.merge initialize_commodity_attributes
          initialize_top_nodes
          @attributes[:summary] = summary
          @attributes
        end

        def summary
          result = summary_of_production
          result << summary_of_production_ranking
          result << summary_of_top_exporter_and_top_consumer
          result
        end

        private

        NAMED_ATTRIBUTES = %w(
          commodity_production commodity_yield area pasture_area
        ).freeze

        def initialize_chart_configuration
          initialize_chart_config(:place, nil, :place_basic_attributes)
          NAMED_ATTRIBUTES.each do |attribute_name|
            attribute = @chart_config.named_attribute(attribute_name)
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
            raise ActiveRecord::RecordNotFound.new(
              'Chart node type "destination" not found (top countries)'
            )
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
          # rubocop:disable Style/GuardClause
          unless @trader_node_type
            raise ActiveRecord::RecordNotFound.new(
              'Chart node type "trader" not found (top traders)'
            )
          end
          # rubocop:enable Style/GuardClause
        end

        def initialize_ancestors
          attributes = {}
          @ancestor_chart_node_types = @chart_config.chart.
            chart_node_types.
            includes(:node_type).
            where(identifier: 'ancestor').
            order(:position)
          @ancestor_chart_node_types.each do |chart_node_type|
            node_type = chart_node_type.node_type
            qual = Api::V3::Qual.find_by_name(node_type.name)
            next unless qual

            node_name = @values.get(qual.simple_type, qual.id)
            next unless node_name

            node = Api::V3::Node.where(node_type_id: node_type.id).
              find_by_name(node_name)
            label = "jurisdiction_#{chart_node_type.position + 1}"
            instance_variable_set("@#{label}", node)
            attributes[:"#{label}"] = node_name
            attributes[:"#{label}_geo_id"] = node.geo_id if node
          end
          attributes
        end

        def attribute_value(attribute)
          return nil unless attribute

          @values.get(attribute.simple_type, attribute.id)
        end

        def initialize_pasture_area
          @pasture_area = @pasture_area_attribute &&
            attribute_value(@pasture_area_attribute)
        end

        def initialize_area
          @area = @area_attribute && attribute_value(@area_attribute)
        end

        def initialize_commodity_production
          @commodity_name = @context.commodity.name.downcase
          if @commodity_production_attribute
            @commodity_production = attribute_value(
              @commodity_production_attribute
            )
            @commodity_production_unit = @commodity_production_attribute.unit
          end
          return unless @commodity_production

          @commodity_production_formatted = helper.number_with_precision(
            @commodity_production, delimiter: ',', precision: 0
          )
        end

        def initialize_commodity_yield
          @commodity_yield = @commodity_yield_attribute && attribute_value(
            @commodity_yield_attribute
          )
        end

        def initialize_commodity_area
          return unless @commodity_production && @commodity_yield

          @commodity_area_formatted = helper.number_with_precision(
            @commodity_production / @commodity_yield,
            delimiter: ',', precision: 0
          )
          @commodity_area_unit = 'ha' # soy prod in Tn, soy yield in Tn/Ha
        end

        def initialize_commodity_attributes
          commodity_attributes = {header_attributes: {}}

          initialize_pasture_area
          if @pasture_area
            commodity_attributes[:header_attributes][:pasture_area] =
              header_attributes('pasture_area')
          end
          initialize_area
          if @area
            commodity_attributes[:area] = @area
            commodity_attributes[:header_attributes][:area] =
              header_attributes('area')
          end

          initialize_commodity_production
          if @commodity_production
            commodity_attributes[:commodity_production] = @commodity_production
            commodity_attributes[:header_attributes][:commodity_production] =
              header_attributes('commodity_production')
          end

          initialize_commodity_yield

          initialize_commodity_area
          if @commodity_area_formatted
            commodity_attributes[:commodity_area] = @commodity_area_formatted
          end
          commodity_attributes[:header_attributes][:commodity_area] = {
            value: @commodity_area_formatted,
            name: "#{@commodity_name} land",
            unit: 'ha',
            tooltip: "Area of land used to grow #{@commodity_name}"
          }

          commodity_attributes
        end

        def header_attributes(attribute_name)
          attribute = @chart_config.named_chart_attribute(attribute_name)
          name_and_tooltip = get_name_and_tooltip.call(
            attribute: attribute.readonly_attribute,
            context: @context,
            defaults: Api::V3::AttributeNameAndTooltip::NameAndTooltip.new(attribute.display_name, attribute.tooltip_text)
          )
          {
            value: instance_variable_get("@#{attribute_name}"),
            name: name_and_tooltip.display_name,
            unit: attribute.unit,
            tooltip: name_and_tooltip.tooltip_text
          }
        end

        def initialize_top_nodes
          exporter_top_nodes = Api::V3::Profiles::SingleContextTopNodesList.new(
            @context,
            @trader_node_type,
            @node,
            year_start: @year,
            year_end: @year
          )
          consumer_top_nodes = Api::V3::Profiles::SingleContextTopNodesList.new(
            @context,
            @destination_node_type,
            @node,
            year_start: @year,
            year_end: @year
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

        def summary_of_production
          return '' unless @commodity_production

          if @commodity_production.zero?
            return "<span class=\"notranslate\">#{@node.name.capitalize}</span> \
did not produce any #{@commodity_name} in \
<span class=\"notranslate\">#{@year}</span>."
          end

          summary_text = "In <span class=\"notranslate\">#{@year}</span>, \
<span class=\"notranslate\">#{@node.name.capitalize}</span> produced \
<span class=\"notranslate\">#{@commodity_production_formatted}</span> \
<span class=\"notranslate\">#{@commodity_production_unit}</span> of \
<span class=\"notranslate\">#{@commodity_name}</span>"
          if @commodity_area_formatted
            summary_text << "\
  occupying a total of \
  <span class=\"notranslate\">#{@commodity_area_formatted}</span> \
  <span class=\"notranslate\">#{@commodity_area_unit}</span> of land"
          end
          summary_text << "."

          summary_text
        end

        # rubocop:disable Metrics/AbcSize
        def summary_of_production_ranking
          return '' unless @commodity_production_attribute

          total_commodity_production = Api::V3::NodeQuant.
            for_context(@context.id).
            where(quant_id: @commodity_production_attribute.id, year: @year).
            sum(:value)

          percentage_total_production =
            if @commodity_production && total_commodity_production.positive?
              helper.number_to_percentage(
                (@commodity_production / total_commodity_production) * 100,
                delimiter: ',', precision: 2
              )
            end
          country_ranking = CountryRanking.new(@context, @node, @year).
            position_for_attribute(@commodity_production_attribute)
          if country_ranking.present?
            country_ranking = country_ranking.ordinalize
          end
          if @jurisdiction_1.present? &&
              @jurisdiction_1.node_type.name == NodeTypeName::STATE
            state_ranking = StateRanking.
              new(@context, @node, @year, @jurisdiction_1.name).
              position_for_attribute(@commodity_production_attribute)
            state_name = @jurisdiction_1.name.titleize
          end
          if state_ranking.present?
            state_ranking_text = ", and <span class=\"notranslate\">\
#{state_ranking.ordinalize}</span> in the state of \
<span class=\"notranslate\">#{state_name}</span>"
          end

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
<span class=\"notranslate\">#{@commodity_name}</span> \
production#{state_ranking_text}."
        end
        # rubocop:enable Metrics/AbcSize

        def summary_of_top_exporter_and_top_consumer
          top_exporter = @top_exporters.first
          if top_exporter.present?
            top_exporter_name = top_exporter['name']&.capitalize
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
            " The largest exporter of #{@commodity_name} in \
<span class=\"notranslate\">#{@node.name.capitalize}</span> was \
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
