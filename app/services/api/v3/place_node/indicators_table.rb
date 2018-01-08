module Api
  module V3
    module PlaceNode
      class IndicatorsTable
        include Api::V3::Profiles::AttributesInitializer

        def initialize(context, year, node)
          @context = context
          @year = year
          @node = node
          @place_quals = Dictionary::PlaceQuals.new(@node, @year)
          state_qual = @place_quals.get(NodeTypeName::STATE)
          @state_name = state_qual && state_qual['value']
          if @state_name.present?
            @state_ranking = StateRanking.new(@context, @year, @node, @state_name)
          end
          @place_quants = Dictionary::PlaceQuants.new(@node, @year)
          @place_inds = Dictionary::PlaceInds.new(@node, @year)
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
            attribute_values =
              if attribute_hash[:attribute].is_a? Api::V3::Quant
                @place_quants
              elsif attribute_hash[:attribute].is_a? Api::V3::Ind
                @place_inds
              end
            attribute_value = attribute_values&.get(
              attribute_hash[:attribute_name]
            )
            value = attribute_value['value'] if attribute_value
            values << value
            next unless @state_ranking.present?
            ranking_scores << @state_ranking.position_for_attribute(
              attribute_hash[:attribute]
            )
          end
          included_columns = attributes.map do |attribute_hash|
            {
              name: attribute_hash[:attribute]['display_name'],
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
      end
    end
  end
end
