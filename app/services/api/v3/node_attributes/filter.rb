module Api
  module V3
    module NodeAttributes
      class Filter
        def initialize(context, start_year, end_year)
          @context = context
          @years = (start_year..end_year).to_a
        end

        def result
          result = [
            ['ind', Api::V3::NodeInd], ['quant', Api::V3::NodeQuant]
          ].map do |attribute_type, attribute_node_values_class|
            attribute_values_query(attribute_type, attribute_node_values_class)
          end.reduce(&:+)
          result.map do |node_attr|
            h = node_attr.attributes
            h.delete('id')
            h
          end
        end

        private

        def attribute_values_query(attribute_type, attribute_node_values_class)
          node_values = attribute_node_values_class.table_name
          attribute_node_values_class.
            select("#{node_values}.node_id").
            select("#{node_values}.#{attribute_type}_id AS attribute_id").
            select("'#{attribute_type}'::TEXT AS attribute_type").
            select("SUM(#{node_values}.value) AS value").
            select(bucket_case(node_values, 3)).
            select(bucket_case(node_values, 5)).
            joins("JOIN nodes ON nodes.id = #{node_values}.node_id").
            joins("JOIN context_node_types cnt ON \
cnt.node_type_id = nodes.node_type_id").
            joins("JOIN map_attributes_mv ma ON \
ma.original_attribute_id = #{node_values}.#{attribute_type}_id AND \
ma.attribute_type = '#{attribute_type}'").
            where('cnt.context_id' => @context.id).
            where("#{node_values}.year IN (?) OR #{node_values}.year IS NULL", @years).
            where('ma.is_disabled' => false).
            where('ma.years IS NULL OR ma.years && ARRAY[?]', @years).
            where('ma.context_id' => @context.id).
            group(
              "#{node_values}.node_id",
              "#{node_values}.#{attribute_type}_id",
              'ma.bucket_3',
              'ma.bucket_5'
            )
        end

        def bucket_case(node_values, bucket_size)
          bucket_name = "bucket_#{bucket_size}"
          bucket_alias = "bucket#{bucket_size}"
          bucket_case = 'CASE'
          bucket_size.downto(2) do |n|
            bucket_case += " WHEN \
SUM(#{node_values}.value) >= ma.#{bucket_name}[#{n - 1}] THEN #{n}"
          end
          bucket_case += " WHEN \
SUM(#{node_values}.value) > 0 THEN 1 ELSE 0"
          bucket_case += " END AS #{bucket_alias}"
        end
      end
    end
  end
end
