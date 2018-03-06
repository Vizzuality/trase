module Api
  module V3
    module Places
      class TrajectoryDeforestationPlot
        include Api::V3::Profiles::AttributesInitializer

        # @param context [Api::V3::Context]
        # @param node [Api::V3::Node]
        # @param year [Integer]
        def initialize(context, node, year)
          @context = context
          @year = year
          @node = node
          @place_quals = Dictionary::PlaceQuals.new(@node, @year)
          state_qual = @place_quals.get(NodeTypeName::STATE)
          @state_name = state_qual && state_qual['value']
          if @state_name.present?
            @state_ranking = StateRanking.new(
              @context, @node, @year, @state_name
            )
          end
          initialize_attributes(attributes_list)
        end

        def call
          min_year, max_year = initialize_min_max_year

          return {} unless min_year.present? and max_year.present?

          years = (min_year..max_year).to_a
          {
            included_years: years,
            unit: 'ha',
            lines: @attributes.map do |attribute_hash|
              data =
                if attribute_hash[:state_average] && @state_ranking
                  @state_ranking.average_for_attribute(
                    attribute_hash[:attribute]
                  )
                elsif attribute_hash[:attribute_type] == 'quant'
                  @node.temporal_place_quants.where(
                    quant_id: attribute_hash[:attribute].id
                  )
                elsif attribute_hash[:attribute_type] == 'ind'
                  @node.temporal_place_inds.where(
                    inds_id: attribute_hash[:attribute].id
                  )
                end
              values = Hash[
                data.map { |e| [e['year'], e] }
              ]
              {
                name: attribute_hash[:name],
                legend_name: attribute_hash[:legend_name],
                legend_tooltip: attribute_hash[:attribute][:tooltip_text],
                type: attribute_hash[:type],
                style: attribute_hash[:style],
                values: years.map { |y| values[y] && values[y]['value'] }
              }
            end
          }
        end

        private

        def initialize_min_max_year
          min_year = nil
          max_year = nil
          @attributes.each do |attribute_hash|
            min_max =
              if attribute_hash[:attribute_type] == 'quant'
                @node.temporal_place_quants.where(
                  quant_id: attribute_hash[:attribute].id
                )
              elsif attribute_hash[:attribute_type] == 'ind'
                @node.temporal_place_inds.where(
                  ind_id: attribute_hash[:attribute].id
                )
              end.except(:select).order(nil).
                select('MIN(year), MAX(year)')

            min_max = min_max.first
            if min_max && min_max['min'].present? &&
                (min_year.nil? || min_max['min'] < min_year)
              min_year = min_max['min']
            end
            if min_max && min_max['max'].present? &&
                (max_year.nil? || min_max['max'] > max_year)
              max_year = min_max['max']
            end
          end
          [min_year, max_year]
        end

        def attributes_list
          [
            {
              name: 'Soy deforestation',
              attribute_type: 'quant',
              attribute_name: 'AGROSATELITE_SOY_DEFOR_',
              legend_name: 'Soy deforestation',
              type: 'area',
              style: 'area-pink'
            },
            {
              name: 'Territorial Deforestation',
              attribute_type: 'quant',
              attribute_name: 'DEFORESTATION_V2',
              legend_name: 'Territorial<br/>Deforestation',
              type: 'area',
              style: 'area-black'
            },
            {
              name: 'State Average',
              attribute_type: 'quant',
              attribute_name: 'DEFORESTATION_V2',
              legend_name: 'State<br/>Average',
              type: 'line',
              style: 'line-dashed-black',
              state_average: true
            }
          ]
        end
      end
    end
  end
end
