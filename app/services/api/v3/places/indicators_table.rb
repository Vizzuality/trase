module Api
  module V3
    module Places
      class IndicatorsTable
        include Api::V3::Profiles::AttributesInitializer

        # @param context [Api::V3::Context]
        # @param node [Api::V3::Node]
        # @param year [Integer]
        def initialize(context, node, year)
          @context = context
          @node = node
          @year = year
          @place_quals = Dictionary::PlaceQuals.new(@node, @year)
          state_qual = @place_quals.get(NodeTypeName::STATE)
          @state_name = state_qual && state_qual['value']
          if @state_name.present?
            @state_ranking = StateRanking.new(
              @context, @node, @year, @state_name
            )
          end
          @place_quants = Dictionary::PlaceQuants.new(@node, @year)
          @place_inds = Dictionary::PlaceInds.new(@node, @year)
        end

        def call
          [
            :environmental_indicators,
            :socioeconomic_indicators,
            :agricultural_indicators,
            :territorial_governance
          ].map do |identifier|
            chart = initialize_chart(:place, :indicators, identifier)
            indicators_group(chart)
          end
        end

        def indicators_group(chart)
          # fetch frontend names and units
          chart_attributes, attributes = initialize_attributes(chart)
          values = []
          ranking_scores = []
          attributes.each do |attribute|
            attribute_values =
              if attribute.is_a? Api::V3::Quant
                @place_quants
              elsif attribute.is_a? Api::V3::Ind
                @place_inds
              end
            attribute_value = attribute_values&.get(
              attribute.name
            )
            value = attribute_value['value'] if attribute_value
            values << value
            next unless @state_ranking.present?
            ranking_scores << @state_ranking.position_for_attribute(
              attribute
            )
          end
          included_columns = chart_attributes.map do |chart_attribute|
            {
              name: chart_attribute.display_name,
              unit: chart_attribute.unit,
              tooltip: chart_attribute.tooltip_text
            }
          end
          {
            name: chart.title,
            included_columns: included_columns,
            rows: [
              {name: 'Score', have_unit: true, values: values},
              {name: 'State Ranking', have_unit: false, values: ranking_scores}
            ]
          }
        end
      end
    end
  end
end
