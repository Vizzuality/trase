module Api
  module V3
    module Flows
      class Result
        include ActiveModel::Serialization
        attr_reader :errors, :data, :include

        def initialize(filter_flows)
          @errors = filter_flows.errors
          return if @errors.any?
          @flows = filter_flows.flows
          @active_nodes = filter_flows.active_nodes
          @total_height = filter_flows.total_height
          @other_nodes_ids = filter_flows.other_nodes_ids
          @cont_attribute = filter_flows.cont_attribute
          @ncont_attribute = filter_flows.ncont_attribute
          initialize_data
          initialize_include
        end

        def initialize_data
          result = {}
          @flows.each do |flow|
            path = flow.path
            identifier = flow.path.dup
            result[identifier] = initialize_flow_hash(flow, identifier)
          end

          @data = process_data(result)
        end

        def initialize_flow_hash(flow, identifier)
          flow_hash = {
            path: flow.path,
            quant: flow['quant_value']
          }

          add_ncont_attribute_data(flow, flow_hash, identifier)

          flow_hash
        end

        def add_ncont_attribute_data(flow, flow_hash, identifier)
          return unless @ncont_attribute

          if @ncont_attribute.qual?
            flow_hash[:qual] = flow['qual_value']
            identifier << flow['qual_value']
          elsif @ncont_attribute.ind?
            flow_hash[:ind] = flow['ind_value']
            identifier << flow['ind_value']
          end
        end

        def process_data(result)
          result.values.map do |flow_hash|
            flow_hash[:height] = format('%0.6f', (flow_hash[:quant] / @total_height)).to_f
            flow_hash[:quant] = format('%0.6f', flow_hash[:quant]).to_f
            flow_hash
          end
        end

        def initialize_include
          @include = {
            node_heights: @active_nodes.map do |node_id, value|
              {
                id: node_id,
                height: format('%0.6f', (value / @total_height)).to_f,
                quant: format('%0.6f', value).to_f
              }
            end
          }
        end

        def self.model_name
          Api::V3::Flows::Result
        end
      end
    end
  end
end
