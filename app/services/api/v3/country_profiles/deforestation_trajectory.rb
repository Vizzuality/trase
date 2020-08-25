module Api
  module V3
    module CountryProfiles
      class DeforestationTrajectory < Api::V3::Profiles::StackedLineChart
        # @param node [Api::V3::Readonly::NodeWithFlows]
        # @param year [Integer]
        # @param profile_options [Hash]
        # @option profile_options [String] profile_type
        # @option profile_options [String] chart_identifier
        def initialize(node, year, profile_options)
          super(
            node.context, node, year, profile_options
          )
        end
      end
    end
  end
end
