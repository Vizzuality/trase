module Api
  module V3
    module Places
      class TopConsumerCountries
        include Api::V3::Profiles::AttributesInitializer

        # @param context [Api::V3::Context]
        # @param node [Api::V3::Readonly::NodeWithFlows]
        # @param year [Integer]
        def initialize(context, node, year)
          @context = context
          @node = node
          initialize_chart_config(
            :place, nil, :place_top_consumer_countries
          )
          @destination_node_type = @chart_config.named_node_type('destination')
          unless @destination_node_type
            raise ActiveRecord::RecordNotFound.new(
              'Chart node type "destination" not found'
            )
          end

          @mini_sankey = Api::V3::Profiles::MiniSankeyForContext.new(
            context, node, year
          )
        end

        def call
          @mini_sankey.call(
            @destination_node_type,
            true
          )
        end
      end
    end
  end
end
