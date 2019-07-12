module Api
  module V3
    module Dashboards
      module ChartParameters
        class NodeValues < Base
          attr_reader :cont_attribute,
                      :node_id

          # @param params [Hash]
          # @option params [Integer] cont_attribute_id
          # @option params [Integer] node_id
          def initialize(params)
            super

            initialize_cont_attribute params[:cont_attribute_id]

            @node_id = params[:node_id]
          end

          def node
            return @node if defined? @node

            @node = Api::V3::Node.includes(:node_type).find(@node_id)
          end

          private

          def initialize_cont_attribute(cont_attribute_id)
            return unless cont_attribute_id.present?

            @cont_attribute = Api::V3::Readonly::Attribute.find(cont_attribute_id)
          end
        end
      end
    end
  end
end
