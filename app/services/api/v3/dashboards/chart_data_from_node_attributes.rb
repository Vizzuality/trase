module Api
  module V3
    module Dashboards
      class ChartDataFromNodeAttributes
        def initialize(attribute, countries_ids, commodities_ids, nodes_ids)
          @attribute = attribute
          @countries_ids = countries_ids
          @commodities_ids = commodities_ids
          @nodes_ids = nodes_ids
          raise 'Node missing' unless @nodes_ids.any?

          initialize_nodes_ids_with_data
          initialize_query
        end

        def call
          data_by_x = {}
          @queries.each.with_index do |query, idx|
            query.all.each do |record|
              data_by_x[record['x']] ||= {}
              data_by_x[record['x']]["y#{idx}"] = record["y#{idx}"]
            end
          end
          @data = data_by_x.map do |key, value|
            value.merge(x: key)
          end
          x_axis_label, x_axis_type =
            if @attribute.temporal?
              %w(Year category)
            else
              %w(Node categorical)
            end

          @meta = {
            xAxis: {
              label: x_axis_label,
              prefix: '',
              format: '',
              suffix: ''
            },
            yAxis: {
              label: @attribute.display_name,
              prefix: '',
              format: '',
              suffix: @attribute.unit
            },
            x: {
              type: x_axis_type, # category || date || number
              label: x_axis_label,
              tooltip: {prefix: '', format: '', suffix: ''}
            }
          }

          @nodes_with_data.each.with_index do |node, idx|
            @meta["y#{idx}"] = {
              type: 'number',
              label: node.name,
              tooltip: {prefix: '', format: '', suffix: ''}
            }
          end
          [@data, @meta]
        end

        private

        def initialize_nodes_ids_with_data
          nodes_ids_with_data = @nodes_ids.select do |node_id|
            @attribute.node_values_class.
              where(@attribute.attribute_id_name => @attribute.original_id).
              where(node_id: node_id).
              any?
          end
          @nodes_with_data = Api::V3::Node.where(id: nodes_ids_with_data)
        end

        def initialize_query
          @queries = []
          q = @attribute.node_values_class.
            joins(node: {node_type: {context_node_types: :context}}).
            where(@attribute.attribute_id_name => @attribute.original_id)

          q =
            if @attribute.temporal?
              q.select('year AS x')
            else
              q.select('nodes.name AS x')
            end

          if @countries_ids.any?
            q = q.where('contexts.country_id' => @countries_ids)
          end
          if @commodities_ids.any?
            q = q.where('contexts.commodity_id' => @commodities_ids)
          end

          @nodes_with_data.each.with_index do |node, idx|
            @queries << q.select("value AS y#{idx}").where(node_id: node.id)
          end
        end
      end
    end
  end
end
