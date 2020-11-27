module Api
  module V3
    module MapLayers
      class MapAttributeFilter
        include ActiveSupport::Configurable

        config_accessor :get_tooltip do
          Api::V3::Profiles::GetTooltipPerAttribute
        end

        config_accessor :prepare_map_attribute do
          Api::V3::MapLayers::MapAttributeNormalizer
        end

        # @param context [Api::V3::Context]
        # @param start_year [Integer]
        # @param end_year [Integer]
        def initialize(context, start_year, end_year)
          @context = context
          @years = (start_year..end_year).to_a
        end

        def call
          map_attributes = Api::V3::Readonly::MapAttribute.
            select([
              'color_scale',
              "#{Api::V3::Readonly::MapAttribute.table_name}.id",
              "aggregated_buckets(dual_layer_buckets, years, ARRAY#{@years}, \
attribute_type) AS dual_layer_buckets",
              "aggregated_buckets(single_layer_buckets, years, ARRAY#{@years}, \
attribute_type) AS single_layer_buckets",
              'map_attribute_group_id AS group_id',
              'is_default',
              'is_disabled',
              'years',
              "#{Api::V3::Readonly::MapAttribute.table_name}.name",
              'attribute_type AS type',
              'unit',
              'description',
              'original_attribute_id AS layer_attribute_id',
              'map_attribute_group_id AS group_id',
              'attribute_id'
            ]).
            joins(:map_attribute_group).
            where(
              is_disabled: false,
              "#{Api::V3::MapAttributeGroup.table_name}.context_id": @context.id
            ).
            order(position: :asc)
          map_attributes.map { |map_attr| get_map_attribute_with_correct_tooltip(map_attr) }
        end

        private

        def get_map_attribute_with_correct_tooltip(map_attribute)
          prepared_map_attribute = prepare_map_attribute.call(map_attribute)
          # rubocop:disable Style/EachWithObject
          map_attribute.attributes.inject({}) do |new_hash, (k, v)|
            new_hash[k] = v
            new_hash['description'] = get_tooltip.call(
              ro_chart_attribute: prepared_map_attribute,
              context: @context
            )
            new_hash
          end
          # rubocop:enable Style/EachWithObject
        end
      end
    end
  end
end
