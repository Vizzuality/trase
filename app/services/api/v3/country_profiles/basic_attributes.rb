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
            header_attributes: header_attributes,
            summary: summary
          }
        end

        def summary
          'TODO'
        end

        private

        HEADER_ATTRIBUTES = [
          {source: :wb, id: 'SP.POP.TOTL'},
          {source: :wb, id: 'NY.GDP.MKTP.CD'},
          {source: :comtrade, id: 'trade_value'},
          {source: :wb, id: 'AG.LND.TOTL.K2'},
          {source: :wb, id: 'AG.LND.AGRI.K2'},
          {source: :wb, id: 'AG.LND.FRST.K2'}
        ]

        def header_attributes
          list = ExternalAttributesList.instance
          attributes = list.call(HEADER_ATTRIBUTES).compact
          attributes.map.with_index do |attribute, idx|
            value = ExternalAttributeValue.instance.call(
              @node.geo_id, @year, @activity, HEADER_ATTRIBUTES[idx]
            )
            attribute.merge(value: value)
          end
        end
      end
    end
  end
end
