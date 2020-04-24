module Api
  module V3
    module CountryProfiles
      class BasicAttributes
        # @param node [Api::V3::Node]
        # @param year [Integer]
        def initialize(node, year)
          @node = node
          @year = year
          @activity =
            if @node.node_type == NodeTypeName::COUNTRY_OF_PRODUCTION
              :exporter
            else
              :importer
            end
        end

        def call
          {
            name: @node.name,
            geo_id: @node.geo_id,
            header_attributes: header_attributes_with_values,
            summary: summary
          }
        end

        def summary
          attributes_map = Hash[
            summary_attributes_with_values.map { |a| [a[:name], a[:value]] }
          ]
          total_land_rank = attributes_map[:total_land_rank]
          population_rank = attributes_map[:population_rank]
          gdp_rank = attributes_map[:gdp_rank]
          summary = overview(total_land_rank, population_rank, gdp_rank)

          total_land = attributes_map[:total_land]
          forest_land = attributes_map[:forest_land]
          agricultural_land = attributes_map[:agricultural_land]
          summary << land_summary(total_land, forest_land, agricultural_land)

          hdi_rank = attributes_map[:hdi_rank]
          if hdi_rank
            summary << " Its placement in the Human Development Index is #{hdi_rank}."
          end
          # TODO: signatory to declarations
          summary
        end

        private

        HEADER_ATTRIBUTES = [
          {source: :wb, id: 'SP.POP.TOTL'},
          {source: :wb, id: 'NY.GDP.MKTP.CD'},
          {source: :com_trade, id: :value},
          {source: :wb, id: 'AG.LND.TOTL.K2'},
          {source: :wb, id: 'AG.LND.AGRI.K2'},
          {source: :wb, id: 'AG.LND.FRST.K2'}
        ].freeze

        SUMMARY_ATTRIBUTES = [
          {source: :wb, id: 'AG.LND.TOTL.K2', rank: true, name: :total_land_rank},
          {source: :wb, id: 'SP.POP.TOTL', rank: true, name: :population_rank},
          {source: :wb, id: 'NY.GDP.MKTP.CD', rank: true, name: :gdp_rank},
          {source: :wb, id: 'AG.LND.TOTL.K2', name: :total_land},
          {source: :wb, id: 'AG.LND.FRST.K2', name: :forest_land},
          {source: :wb, id: 'AG.LND.AGRI.K2', name: :agricultural_land},
          {source: :wb, id: 'UNDP.HDI.XD', rank: true, name: :hdi_rank}
        ].freeze

        def header_attributes_with_values
          attributes_with_values(HEADER_ATTRIBUTES)
        end

        def summary_attributes_with_values
          attributes_with_values(SUMMARY_ATTRIBUTES)
        end

        def attributes_with_values(attributes_without_values)
          list = ExternalAttributesList.instance
          attributes = list.call(
            attributes_without_values, {trade_flow: @activity.to_s.sub(/er$/, '')}
          ).compact
          attributes_without_values.map.with_index do |attribute, idx|
            attribute_value = ExternalAttributeValue.instance.call(
              @node.commodity_id,
              @node.geo_id,
              @year,
              @activity,
              attributes_without_values[idx]
            )
            next unless attribute_value

            value =
              if attribute[:rank]
                attribute_value[:rank]
              else
                attribute_value[:value]
              end
            attribute.merge(value: value)
          end.compact
        end

        def overview(total_land_rank, population_rank, gdp_rank)
          summary = "#{@node.name} is the world's"
          summary << " #{total_land_rank} largest country by land mass"
          summary << ", #{population_rank} largest by population size"
          summary << " and is the world's #{gdp_rank} largest economy (by GDP)."
        end

        def land_summary(total_land, forest_land, agricultural_land)
          return '' unless total_land && (forest_land || agricultural_land)

          if forest_land
            forest_percent = helper.number_to_percentage(
              (forest_land * 100.0) / total_land,
              precision: 0
            )
          end
          if agricultural_land
            agricultural_percent = helper.number_to_percentage(
              (agricultural_land * 100.0) / total_land,
              precision: 0
            )
          end
          if forest_percent && agricultural_percent
            " Forests make up #{forest_percent} of its land mass and agricultural areas, #{agricultural_percent}."
          elsif forest_percent
            " Forests make up #{forest_percent} of its land mass."
          elsif agricultural_percent
            " Agricultural areas make up #{agricultural_percent} of its land mass."
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
