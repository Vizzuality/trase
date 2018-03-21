module Api
  module V3
    module NodeAttributes
      class Filter
        # @param context [Api::V3::Context]
        # @param start_year [Integer]
        # @param end_year [Integer]
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
            select(select_list(attribute_type, node_values)).
            joins("JOIN nodes ON nodes.id = #{node_values}.node_id").
            joins("JOIN context_node_types cnt ON \
cnt.node_type_id = nodes.node_type_id").
            joins("JOIN map_#{attribute_type}s maa ON \
maa.#{attribute_type}_id = #{node_values}.#{attribute_type}_id").
            joins('JOIN map_attributes_mv ma ON maa.map_attribute_id = ma.id').
            where('cnt.context_id' => @context.id).
            where(
              "#{node_values}.year IN (?) OR #{node_values}.year IS NULL",
              @years
            ).
            where('ma.context_id' => @context.id, 'ma.is_disabled' => false).
            where('ma.years IS NULL OR ma.years && ARRAY[?]', @years).
            group(
              "#{node_values}.node_id",
              "#{node_values}.#{attribute_type}_id",
              'ma.dual_layer_buckets',
              'ma.single_layer_buckets'
            )
        end

        def select_list(attribute_type, node_values)
          dual_layer_bucket = <<~SQL
            revamp.BUCKET_INDEX(
              dual_layer_buckets, SUM(#{node_values}.value)
            ) AS dual_layer_bucket
          SQL
          single_layer_bucket = <<~SQL
            revamp.BUCKET_INDEX(
              single_layer_buckets, SUM(#{node_values}.value)
            ) AS single_layer_bucket
          SQL
          [
            "#{node_values}.node_id",
            "#{node_values}.#{attribute_type}_id AS attribute_id",
            "'#{attribute_type}'::TEXT AS attribute_type",
            "SUM(#{node_values}.value) AS value",
            dual_layer_bucket,
            single_layer_bucket
          ]
        end
      end
    end
  end
end
