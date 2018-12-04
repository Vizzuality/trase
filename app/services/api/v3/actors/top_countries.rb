module Api
  module V3
    module Actors
      class TopCountries
        include Api::V3::Profiles::AttributesInitializer

        # @param context [Api::V3::Context]
        # @param node [Api::V3::Node]
        # @year [Integer]
        def initialize(context, node, year)
          @context = context
          @node = node
          @top_nodes_summary = Api::V3::Actors::TopNodesSummary.new(
            context, node, year
          )
          initialize_chart_config(:actor, nil, :actor_top_countries)
          @destination_node_type = @chart_config.
            named_node_type('destination')
          unless @destination_node_type
            raise 'Chart node type "destination" not found'
          end

          attribute_name = 'commodity_production'
          attribute = @chart_config.named_attribute(attribute_name)
          raise "#{attribute_name} attribute not found" unless attribute

          instance_variable_set("@#{attribute_name}_attribute", attribute)
        end

        # Top nodes (destinations) linked to this actor node across years
        def call
          @top_nodes_summary.call(
            @destination_node_type.name,
            @commodity_production_attribute
          )
        end
      end
    end
  end
end
