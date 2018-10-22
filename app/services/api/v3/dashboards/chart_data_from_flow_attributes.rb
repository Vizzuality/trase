module Api
  module V3
    module Dashboards
      class ChartDataFromFlowAttributes
        def initialize(attribute, countries_ids, commodities_ids, nodes_ids)
          @attribute = attribute
          @countries_ids = countries_ids
          @commodities_ids = commodities_ids
          @nodes_ids = nodes_ids
          initialize_query
        end

        def call
          @data = @query.map { |r| r.attributes.slice('x', 'y1') }
          @meta = {
            xAxis: {
              label: 'Year',
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
              type: 'numeric', # categorical || date || numeric
              label: 'Year',
              tooltip: {prefix: '', format: '', suffix: ''}
            },
            y1: {
              type: 'numeric',
              label: '',
              tooltip: {prefix: '', format: '', suffix: ''}
            }
          }
          [@data, @meta]
        end

        private

        def initialize_query
          q = @attribute.flow_values_class.
            joins(flow: :context).
            select('flows.year AS x').
            where(@attribute.attribute_id_name => @attribute.original_id)

          if @countries_ids.any?
            q = q.where('contexts.country_id' => @countries_ids)
          end
          if @commodities_ids.any?
            q = q.where('contexts.commodity_id' => @commodities_ids)
          end

          q = q.where('flows.path @> ARRAY[?]', @nodes_ids) if @nodes_ids.any?

          q =
            if @attribute.aggregatable?
              q.
                select("#{@attribute.value_aggregate_method}(value) AS y1").
                group('flows.year')
            else
              q.select('value AS y1')
            end

          @query = q
        end
      end
    end
  end
end
