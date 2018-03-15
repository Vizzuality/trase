module Api
  module V3
    module Places
      class TopConsumerActors
        # @param context [Api::V3::Context]
        # @param node [Api::V3::Node]
        # @param year [Integer]
        def initialize(context, node, year)
          @mini_sankey = Api::V3::Places::MiniSankey.new(
            context, node, year
          )
        end

        def call
          @mini_sankey.call(NodeTypeName::EXPORTER, true)
        end
      end
    end
  end
end
