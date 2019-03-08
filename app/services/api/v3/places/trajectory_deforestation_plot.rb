module Api
  module V3
    module Places
      class TrajectoryDeforestationPlot
        include ActiveSupport::Configurable
        include Api::V3::Profiles::AttributesInitializer

        config_accessor :get_tooltip do
          Api::V3::Profiles::GetTooltipPerAttribute
        end

        # @param context [Api::V3::Context]
        # @param node [Api::V3::Node]
        # @param year [Integer]
        def initialize(context, node, year)
          @context = context
          @node = node
          @year = year

          # This remains hardcoded, because it only makes sense
          # for Brazil soy for now
          @place_quals = Dictionary::PlaceQuals.new(@node, @year)
          state_qual = @place_quals.get(NodeTypeName::STATE)
          @state_name = state_qual && state_qual['value']
          if @state_name.present?
            @state_ranking = StateRanking.new(
              @context, @node, @year, @state_name
            )
          end
          @chart_config = initialize_chart_config(
            :place, nil, :place_trajectory_deforestation
          )
          raise 'No attributes found' unless @chart_config.attributes.any?
        end

        # rubocop:disable Metrics/AbcSize
        def call
          min_year, max_year = initialize_min_max_year
          chart_attributes = @chart_config.chart_attributes

          return {} unless min_year.present? and max_year.present?

          years = (min_year..max_year).to_a
          {
            included_years: years,
            unit: 'ha',
            lines: chart_attributes.map.with_index do |chart_attribute, idx|
              attribute = @chart_config.attributes[idx]
              data =
                if chart_attribute.state_average && @state_ranking
                  @state_ranking.average_for_attribute(
                    attribute
                  )
                elsif attribute.is_a? Api::V3::Quant
                  @node.temporal_place_quants.where(
                    quant_id: attribute.id
                  )
                elsif attribute.is_a? Api::V3::Ind
                  @node.temporal_place_inds.where(
                    ind_id: attribute.id
                  )
                end
              values = Hash[
                data.map { |e| [e['year'], e] }
              ]
              {
                name: chart_attribute.display_name,
                legend_name: chart_attribute.legend_name,
                legend_tooltip: get_tooltip.call(
                  ro_chart_attribute: chart_attribute,
                  context: @context
                ),
                type: chart_attribute.display_type,
                style: chart_attribute.display_style,
                values: years.map do |year|
                  values[year] && values[year]['value']
                end
              }
            end
          }
        end
        # rubocop:enable Metrics/AbcSize

        private

        def initialize_min_max_year
          min_years = []
          max_years = []
          @chart_config.attributes.each do |attribute|
            min_max =
              if attribute.is_a? Api::V3::Quant
                @node.temporal_place_quants.where(
                  quant_id: attribute.id
                )
              elsif attribute.is_a? Api::V3::Ind
                @node.temporal_place_inds.where(
                  ind_id: attribute.id
                )
              end
            min_max = min_max.
              except(:select).
              select('MIN(year), MAX(year)').
              order(nil).
              first
            next unless min_max

            min_years << min_max['min']
            max_years << min_max['max']
          end
          [min_years.compact.min, max_years.compact.max]
        end
      end
    end
  end
end
