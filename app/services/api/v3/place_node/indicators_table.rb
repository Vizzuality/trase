module Api
  module V3
    module PlaceNode
      class IndicatorsTable
        def initialize(context, year, node, data)
          @context = context
          @year = year
          @node = node
          @state_name = data[:state_name]
          if @state_name.present?
            @state_ranking = StateRanking.new(@context, @year, @node, @state_name)
          end
          @place_inds = data[:place_inds]
          @place_quants = data[:place_quants]
        end

        def call
          [
            environmental_indicators,
            socioeconomic_indicators,
            agricultural_indicators,
            territorial_governance_indicators
          ]
        end

        def environmental_indicators
          indicators_list = [
            # Territorial deforestation
            {attribute_type: 'quant', attribute_name: 'DEFORESTATION_V2'},
            # Maximum soy deforestation
            {attribute_type: 'quant', attribute_name: 'POTENTIAL_SOY_DEFORESTATION_V2'},
            # Soy deforestation (Cerrado only)
            {attribute_type: 'quant', attribute_name: 'AGROSATELITE_SOY_DEFOR_'},
            # Land based CO2 emissions
            {attribute_type: 'quant', attribute_name: 'GHG_'},
            # Water scarcity
            {attribute_type: 'ind', attribute_name: 'WATER_SCARCITY'},
            # Loss of biodiversity habitat
            {attribute_type: 'quant', attribute_name: 'BIODIVERSITY'}
            # Number of incidences of fire, temporarily disabled
            # {attribute_type: 'quant', attribute_name: 'FIRES_'}
          ]

          indicators_group(indicators_list, 'Environmental indicators')
        end

        def socioeconomic_indicators
          indicators_list = [
            # Human development index
            {attribute_type: 'ind', attribute_name: 'HDI'},
            # GDP per capita
            {attribute_type: 'ind', attribute_name: 'GDP_CAP'},
            # GDP from agriculture
            {attribute_type: 'ind', attribute_name: 'PERC_FARM_GDP_'},
            # Smallholder dominance
            {attribute_type: 'ind', attribute_name: 'SMALLHOLDERS'},
            # Reported cases of forced labour
            {attribute_type: 'quant', attribute_name: 'SLAVERY'},
            # Reported cases of land conflicts
            {attribute_type: 'quant', attribute_name: 'LAND_CONFL'},
            {attribute_type: 'quant', attribute_name: 'POPULATION'}
          ]

          indicators_group(indicators_list, 'Socio-economic indicators')
        end

        def agricultural_indicators
          indicators_list = [
            # Production of soy
            {attribute_type: 'quant', attribute_name: 'SOY_TN'},
            # Soy yield
            {attribute_type: 'ind', attribute_name: 'SOY_YIELD'},
            # Agricultural land used for soy
            {attribute_type: 'ind', attribute_name: 'SOY_AREAPERC'}
          ]

          indicators_group(indicators_list, 'Agricultural indicators')
        end

        def territorial_governance_indicators
          indicators_list = [
            # Permanent protected area deficit
            {attribute_type: 'quant', attribute_name: 'APP_DEFICIT_AREA'},
            # Legal reserve deficit
            {attribute_type: 'quant', attribute_name: 'LR_DEFICIT_AREA'},
            # Forest code deficit
            {attribute_type: 'ind', attribute_name: 'PROTECTED_DEFICIT_PERC'},
            # Number of environmental embargos
            {attribute_type: 'quant', attribute_name: 'EMBARGOES_'}
          ]

          indicators_group(indicators_list, 'Territorial governance')
        end

        def indicators_group(attributes_list, name)
          # fetch frontend names and units
          attributes = initialize_attributes(attributes_list)
          values = []
          ranking_scores = []
          attributes.each do |attribute_hash|
            values_for_current_year =
              if attribute_hash[:attribute].is_a? Api::V3::Quant
                @place_quants
              elsif attribute_hash[:attribute].is_a? Api::V3::Ind
                @place_inds
              else
                []
              end
            if (value_for_current_year = values_for_current_year[attribute_hash[:attribute_name]]).present?
              value = value_for_current_year['value']
            end
            values << value
            if @state_ranking.present?
              ranking_scores << @state_ranking.position_for_attribute(attribute_hash[:attribute])
            end
          end
          included_columns = attributes.map do |attribute_hash|
            {
              name: attribute_hash[:attribute].display_name,
              unit: attribute_hash[:attribute].unit
            }
          end
          {
            name: name,
            included_columns: included_columns,
            rows: [
              {
                name: 'Score',
                have_unit: true,
                values: values
              },
              {
                name: 'State Ranking',
                have_unit: false,
                values: ranking_scores
              }
            ]
          }
        end

        def initialize_attributes(attributes_list)
          attributes = attributes_list.map do |attribute_hash|
            attribute_hash.merge(
              attribute: initialize_attribute_from_hash(
                attribute_hash
              )
            )
          end
          attributes.select do |attribute_hash|
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
            Rails.logger.debug 'NOT FOUND ' + attribute_hash[:attribute_name]
          end
          attribute
        end
      end
    end
  end
end
