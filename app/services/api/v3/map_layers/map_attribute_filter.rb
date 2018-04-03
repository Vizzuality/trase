module Api
  module V3
    module MapLayers
      class MapAttributeFilter
        # @param context [Api::V3::Context]
        # @param start_year [Integer]
        # @param end_year [Integer]
        def initialize(context, start_year, end_year)
          @context = context
          @years = (start_year..end_year).to_a
        end

        def call
          @map_attributes = Api::V3::Readonly::MapAttribute.
            select([
              'color_scale',
              "#{Api::V3::Readonly::MapAttribute.table_name}.id",
              'dual_layer_buckets', # TODO
              'single_layer_buckets', # TODO
              'map_attribute_group_id AS group_id',
              'is_default',
              'years',
              "#{Api::V3::Readonly::MapAttribute.table_name}.name",
              'attribute_type AS type',
              'unit',
              'description',
              'aggregate_method',
              'original_attribute_id AS layer_attribute_id',
              'map_attribute_group_id AS group_id'
            ]).
            joins(:map_attribute_group).
            where(
              is_disabled: false,
              "#{Api::V3::MapAttributeGroup.table_name}.context_id": @context.id
            ).
            order(position: :asc)
        end
      end
    end
  end
end
