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
              attribute = attribute_hash[:attribute]
              data =
                if attribute_hash[:state_average] && @state_ranking
                  @state_ranking.average_for_attribute(
                    attribute
                  )
                elsif attribute_hash[:attribute_type] == 'quant'
                  @node.temporal_place_quants.where(
                    quant_id: attribute.id
                  )
                elsif attribute_hash[:attribute_type] == 'ind'
                  @node.temporal_place_inds.where(
                    inds_id: attribute.id
                  )
                end
              values = Hash[
                data.map { |e| [e['year'], e] }
              ]
              {
                name: attribute_hash[:name],
                legend_name: attribute_hash[:legend_name],
                legend_tooltip: attribute[:tooltip_text],
                type: attribute_hash[:type],
                style: attribute_hash[:style],
                values: years.map do |year|
                  values[year] && values[year]['value']
                end
              }
            end
          }
        end

        private

        def initialize_min_max_year
          min_years = []
          max_years = []
          @attributes.each do |attribute_hash|
            attribute_type = attribute_hash[:attribute_type]
            attribute_id = attribute_hash[:attribute].id
            min_max =
              if attribute_type == 'quant'
                @node.temporal_place_quants.where(
                  quant_id: attribute_id
                )
              elsif attribute_type == 'ind'
                @node.temporal_place_inds.where(
                  ind_id: attribute_id
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
