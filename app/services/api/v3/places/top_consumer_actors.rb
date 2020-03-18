module Api
  module V3
    module Places
      class TopConsumerActors
        include Api::V3::Profiles::AttributesInitializer

        # @param context [Api::V3::Context]
        # @param node [Api::V3::Node]
        # @param year [Integer]
        def initialize(context, node, year)
          @context = context
          @node = node
          initialize_chart_config(:place, nil, :place_top_consumer_actors)
          @trader_node_type = @chart_config.named_node_type('trader')
          unless @trader_node_type
            raise ActiveRecord::RecordNotFound.new(
              'Chart node type "trader" not found'
            )
          end

          @mini_sankey = Api::V3::Profiles::MiniSankeyForContext.new(
            context, node, year
          )
        end

        def call
          @mini_sankey.call(
            @trader_node_type,
            true
          )
        end
      end
    end
  end
end
