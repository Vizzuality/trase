module Api
  module V3
    module PlaceNode
      class TrajectoryDeforestationPlot
        def initialize(context, year, node, data)
          @context = context
          @year = year
          @node = node
          @state_name = data[:state_name]
          if @state_name.present?
            @state_ranking = StateRanking.new(@context, @year, @node, @state_name)
          end
          initialize_attributes
        end

        def call
          min_year, max_year = initialize_min_max_year

          return {} unless min_year.present? and max_year.present?

          years = (min_year..max_year).to_a
          {
            included_years: years,
            unit: 'Ha',
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
                type: attribute_hash[:type],
                style: attribute_hash[:style],
                values: years.map { |y| values[y] && values[y]['value'] }
              }
            end
          }
        end

        private

        def initialize_attributes
          @attributes = attributes_list.map do |attribute_hash|
            attribute_hash.merge(
              attribute: initialize_attribute_from_hash(
                attribute_hash
              )
            )
          end
          @attributes = @attributes.select do |attribute_hash|
            attribute_hash && attribute_hash[:attribute].present?
          end
        end

        def initialize_attribute_from_hash(attribute_hash)
          attribute_class =
            if attribute_hash[:attribute_type] == 'quant'
              Quant
            elsif attribute_hash[:attribute_type] == 'ind'
              Ind
            end
          return nil unless attribute_class
          attribute_type = attribute_hash[:attribute_type]
          attribute_table = attribute_type.pluralize
          attribute_property_type = "#{attribute_type}_property"
          attribute_property_table = attribute_property_type.pluralize
          attribute = attribute_class.
            select(
              :id, :name, "#{attribute_property_table}.display_name", :unit
            ).
            joins("JOIN #{attribute_property_table} ON \
#{attribute_table}.id = #{attribute_property_table}.#{attribute_type}_id").
            where(name: attribute_hash[:attribute_name]).
            first
          if attribute.nil?
            Rails.logger.debug 'NOT FOUND ' + attribute[:attribute_name]
          end
          attribute
        end

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
