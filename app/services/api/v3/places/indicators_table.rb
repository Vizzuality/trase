module Api
  module V3
    module Places
      class IndicatorsTable < Api::V3::Profiles::IndicatorsTable
        # @param context [Api::V3::Context]
        # @param node [Api::V3::Readonly::NodeWithFlows]
        # @param year [Integer]
        def initialize(context, node, year)
          super(
            node,
            year,
            {
              profile_type: Api::V3::Profile::PLACE,
              chart_identifier: :place_indicators
            }
          )
          initialize_state_ranking
        end

        private

        def initialize_state_ranking
          # This remains hardcoded, because it only makes sense
          # for Brazil soy for now
          state_qual = Api::V3::Qual.find_by_name(NodeTypeName::STATE)
          return unless state_qual

          state_name = @values.get(state_qual.simple_type, state_qual.id)
          return unless state_name&.value

          @state_ranking = StateRanking.new(
            @context, @node, @year, state_name.value
          )
        end
      end
    end
  end
end
