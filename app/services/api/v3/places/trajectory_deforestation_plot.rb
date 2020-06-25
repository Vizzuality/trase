module Api
  module V3
    module Places
      class TrajectoryDeforestationPlot < Api::V3::Profiles::StackedLineChart
        # @param context [Api::V3::Context]
        # @param node [Api::V3::Readonly::NodeWithFlows]
        # @param year [Integer]
        def initialize(context, node, year)
          super(
            context, node, year, {
              profile_type: :place,
              chart_identifier: :place_trajectory_deforestation
            }
          )
        end
      end
    end
  end
end
