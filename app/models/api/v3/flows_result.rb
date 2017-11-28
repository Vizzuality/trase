module Api
  module V3
    class FlowsResult
      include ActiveModel::Serialization

      def initialize(filter_flows)
        @flows = filter_flows.flows
        @active_nodes = filter_flows.active_nodes
        @total_height = filter_flows.total_height
        @other_nodes_ids = filter_flows.other_nodes_ids
        @resize_quant = filter_flows.resize_quant
        @recolor_ind = filter_flows.recolor_ind
        @recolor_qual = filter_flows.recolor_qual
      end

      def data
        result = {}
        @flows.each do |flow|
          active_path = flow.path.map.with_index do |node_id, i|
            if !@active_nodes.key?(node_id)
              @other_nodes_ids[i]
            else
              node_id
            end
          end
          identifier = active_path.dup
          flow_hash = {
            path: active_path,
            quant: flow['quant_value']
          }
          if @recolor_qual
            flow_hash[:qual] = flow['qual_value']
            identifier << flow['qual_value']
          elsif @recolor_ind
            flow_hash[:ind] = flow['ind_value']
            identifier << flow['ind_value']
          end

          if result[identifier]
            result[identifier][:quant] += flow['quant_value']
          else
            result[identifier] = flow_hash
          end
        end
        result.values.map do |flow_hash|
          flow_hash[:height] = format('%0.6f', (flow_hash[:quant] / @total_height)).to_f
          flow_hash[:quant] = format('%0.6f', flow_hash[:quant]).to_f
          flow_hash
        end
      end

      def include
        {
          node_heights: @active_nodes.map do |node_id, value|
            {
              id: node_id,
              height: format('%0.6f', (value / @total_height)).to_f,
              quant: format('%0.6f', value).to_f
            }
          end,
          quant: {
            id: @resize_quant.id,
            name: @resize_quant.display_name,
            unit: @resize_quant.unit
          },
          ind: @recolor_ind && {
            id: @recolor_ind.id,
            name: @recolor_ind.display_name,
            unit: @recolor_ind.unit
          },
          qual: @recolor_qual && {
            id: @recolor_qual.id,
            name: @recolor_qual.display_name
          }
        }
      end

      def self.model_name
        Api::V3::FlowsResult
      end
    end
  end
end
