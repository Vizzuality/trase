module Api
  module V3
    module CountryProfiles
      class BasicAttributes
        include ActiveSupport::Configurable
        include Api::V3::Profiles::AttributesInitializer

        config_accessor :get_tooltip do
          Api::V3::Profiles::GetTooltipPerAttribute
        end

        # @param node [Api::V3::Readonly::Node]
        # @param year [Integer]
        def initialize(node, year)
          @node = node
          @context = node.context
          @year = year
          @activity =
            if @node.node_type == NodeTypeName::COUNTRY_OF_PRODUCTION
              :exporter
            else
              :importer
            end
          @external_attribute_value = ExternalAttributeValue.new(
            @node.geo_id,
            @year,
            @activity
          )
          @values = Api::V3::NodeAttributeValuesPreloader.new(@node, @year)
          initialize_chart_config(:country, nil, :country_basic_attributes)
        end

        def call
          @named_summary_attributes = initialize_named_attributes NAMED_SUMMARY_ATTRIBUTES
          @named_header_attributes = initialize_named_attributes NAMED_HEADER_ATTRIBUTES
          {
            name: @node.name,
            geo_id: @node.geo_id,
            header_attributes: header_attributes,
            summary: summary
          }
        end

        def summary
          land_area_rank = @external_attribute_value.call 'wb.land_area.rank'
          population_rank = @external_attribute_value.call 'wb.population.rank'
          gdp_rank = @external_attribute_value.call 'wb.gdp.rank'
          summary = overview(land_area_rank, population_rank, gdp_rank)

          land_area = @external_attribute_value.call 'wb.land_area.value'
          forested_land_area = @external_attribute_value.call 'wb.forested_land_area.value'
          agricultural_land_area = @external_attribute_value.call 'wb.agricultural_land_area.value'
          summary << land_summary(land_area, forested_land_area, agricultural_land_area)
          summary << hdi
          summary << declarations
          summary
        end

        private

        HEADER_ATTRIBUTES = [
          'wb.population.value',
          'wb.gdp.value',
          'wb.land_area.value',
          'wb.agricultural_land_area.value',
          'wb.forested_land_area.value'
        ].freeze

        def header_attributes
          list = ExternalAttributesList.instance
          external = HEADER_ATTRIBUTES.map do |attribute_ref|
            attribute_def = list.call(attribute_ref, substitutions)
            attribute_def.
              except(:short_name, :wb_name).
              merge(value: @external_attribute_value.call(attribute_ref))
          end.compact

          external + @named_header_attributes.values
        end

        NAMED_SUMMARY_ATTRIBUTES = %w(hdi nydf amsterdam).freeze
        NAMED_HEADER_ATTRIBUTES = %w(agricultural_exports agricultural_imports).freeze

        def initialize_named_attributes(collection)
          values = {}
          collection.map do |name|
            original_attribute = @chart_config.named_attribute(name)
            next nil unless original_attribute

            value = @values.get(
              original_attribute.simple_type, original_attribute.id
            )
            next nil unless value

            chart_attribute = @chart_config.named_chart_attribute(name)
            values[chart_attribute.identifier.to_sym] =
              formatted_header_attribute(original_attribute, chart_attribute)
          end
          values
        end

        def formatted_header_attribute(attribute, chart_attribute)
          {
            value: @values.get(attribute.simple_type, attribute.id),
            name: chart_attribute.display_name,
            unit: chart_attribute.unit,
            tooltip: get_tooltip.call(
              ro_chart_attribute: chart_attribute,
              context: @context
            )
          }
        end

        def substitutions
          {trade_flow: @activity.to_s.sub(/er$/, '')}
        end

        def overview(land_area_rank, population_rank, gdp_rank)
          summary = "#{@node.name} is the world's"
          summary << " #{land_area_rank} largest country by land mass"
          summary << ", #{population_rank} largest by population size"
          summary << " and is the world's #{gdp_rank} largest economy (by GDP)."
        end

        def land_summary(land_area, forested_land_area, agricultural_land_area)
          return '' unless land_area && (forested_land_area || agricultural_land_area)

          if forested_land_area
            forested_percent = helper.number_to_percentage(
              (forested_land_area * 100.0) / land_area,
              precision: 0
            )
          end
          if agricultural_land_area
            agricultural_percent = helper.number_to_percentage(
              (agricultural_land_area * 100.0) / land_area,
              precision: 0
            )
          end
          if forested_percent && agricultural_percent
            " Forests make up #{forested_percent} of its land mass and agricultural areas, #{agricultural_percent}."
          elsif forested_percent
            " Forests make up #{forested_percent} of its land mass."
          elsif agricultural_percent
            " Agricultural areas make up #{agricultural_percent} of its land mass."
          end
        end

        def hdi
          hdi = @named_summary_attributes[:hdi]
          return '' unless hdi && hdi[:value]

          " It's placement in the #{hdi[:name]} is #{hdi[:value]}."
        end

        def declarations
          declarations = []
          nydf = @named_summary_attributes[:nydf]
          declarations << nydf[:name] if nydf && nydf[:value]
          amsterdam = @named_summary_attributes[:amsterdam]
          declarations << amsterdam[:name] if amsterdam && amsterdam[:value]
          return '' unless declarations.any?

          " #{@node.name} is a signatory to " + declarations.join(' and ') + '.'
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
