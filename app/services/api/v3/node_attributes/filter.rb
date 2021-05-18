module Api
  module V3
    module NodeAttributes
      class Filter
        # @param context [Api::V3::Context]
        # @param start_year [Integer]
        # @param end_year [Integer]
        # @param layer_ids [Array<Integer>] map_attributes.id
        def initialize(context, start_year, end_year, layer_ids)
          @context = context
          @years = (start_year..end_year).to_a
          @map_attributes = Api::V3::Readonly::MapAttribute.
            includes(:readonly_attribute).
            where(id: layer_ids, context_id: @context.id, is_disabled: false).
            where('years IS NULL OR array_length(years, 1) IS NULL OR years && ARRAY[?]', @years)
        end

        def result
          result = @map_attributes.map do |ma|
            attribute_values_query(ma)
          end.reduce(&:+)

          result.map do |node_attr|
            h = node_attr.attributes
            h.delete('id')
            h
          end
        end

        private

        # @param attribute [Api::V3::Readonly::MapAttribute]
        def attribute_values_query(map_attribute)
          attribute = map_attribute.readonly_attribute
          attribute_type = attribute.original_type.downcase
          node_values_class = attribute.node_values_class
          node_values = node_values_class.table_name
          node_values_class.
            select(select_list(map_attribute)).
            joins("JOIN nodes ON nodes.id = #{node_values}.node_id").
            joins("JOIN context_node_types cnt ON cnt.node_type_id = nodes.node_type_id").
            joins("JOIN map_#{attribute_type}s maa ON maa.#{attribute_type}_id = #{node_values}.#{attribute_type}_id").
            where('cnt.context_id' => @context.id).
            where(
              "#{node_values}.year IN (?) OR #{node_values}.year IS NULL",
              @years
            ).
            where('maa.map_attribute_id' => map_attribute.id).
            group(
              "#{node_values}.node_id",
              "#{node_values}.#{attribute_type}_id"
            )
        end
        # 1191

        # @param attribute [Api::V3::Readonly::MapAttribute]
        def select_list(map_attribute)
          attribute = map_attribute.readonly_attribute
          agg_value =
            if ['SUM', 'AVG', 'MAX', 'MIN'].include?(attribute.aggregation_method.upcase)
              "#{attribute.aggregation_method}(value)"
            else
              'SUM(value)'
            end
          agg_dual_layer_buckets = <<-SQL
            aggregated_buckets(
              ARRAY#{map_attribute.dual_layer_buckets || []}::DOUBLE PRECISION[],
              ARRAY#{map_attribute.years || []}::INTEGER[],
              ARRAY#{@years}::INTEGER[],
              '#{attribute.aggregation_method}'::TEXT
            )
          SQL
          agg_single_layer_buckets = <<-SQL
            aggregated_buckets(
              ARRAY#{map_attribute.single_layer_buckets || []}::DOUBLE PRECISION[],
              ARRAY#{map_attribute.years || []}::INTEGER[],
              ARRAY#{@years}::INTEGER[],
              '#{attribute.aggregation_method}'::TEXT
            )
          SQL
          [
            "node_id",
            "'#{attribute.original_id}'::INT AS attribute_id",
            "LOWER('#{attribute.original_type}')::TEXT AS attribute_type",
            "#{agg_value} AS value",
            "BUCKET_INDEX(#{agg_dual_layer_buckets}, #{agg_value}) AS dual_layer_bucket",
            "BUCKET_INDEX(#{agg_single_layer_buckets}, #{agg_value}) AS single_layer_bucket"
          ]
        end
      end
    end
  end
end
