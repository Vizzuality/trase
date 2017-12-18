module Api
  module V3
    module ActorNode
      class FlowsForNode
        def initialize(context, year, node)
          @context = context
          @year = year
          @node = node
          @node_index = NodeType.node_index_for_id(@context, node.node_type_id)
        end

        def flow_values_all_years(attribute)
          attribute_type = attribute.class.name.demodulize.downcase
          flow_values = :"flow_#{attribute_type}s"
          Flow.
            joins(flow_values).
            where("#{flow_values}.#{attribute_type}_id" => attribute.id).
            where('path[?] = ?', @node_index, @node.id).
            where(context_id: @context.id)
        end

        def flow_values(attribute)
          flow_values_all_years(attribute).where(year: @year)
        end

        def available_years_for_attribute(attribute)
          flow_values_all_years(attribute).select(:year).order(:year).distinct.pluck(:year)
        end
      end
    end
  end
end
