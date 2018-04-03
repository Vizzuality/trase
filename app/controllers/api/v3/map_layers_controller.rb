module Api
  module V3
    class MapLayersController < ApiController
      def index
        ensure_required_param_present(:year_start)

        contextual_layers = Api::V3::MapLayers::ContextualLayerFilter.new(
          @context
        ).call

        dimension_groups = Api::V3::MapAttributeGroup.
          select('DISTINCT name, id, position').
          where(context_id: @context.id).
          order('position ASC, id ASC')

        dimensions = Api::V3::Readonly::MapAttribute.
          select(
            [
              'color_scale',
              "#{Api::V3::Readonly::MapAttribute.table_name}.id",
              'dual_layer_buckets',
              'single_layer_buckets',
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
            ]
          ).
          joins(:map_attribute_group).
          where(
            is_disabled: false,
            "#{Api::V3::MapAttributeGroup.table_name}.context_id": @context.id
          ).
          order(position: :asc)

        serialized_contextual_layers =
          ActiveModelSerializers::SerializableResource.new(
            contextual_layers,
            each_serializer: Api::V3::MapLayers::ContextualLayerSerializer,
            root: 'contextualLayers'
          ).serializable_hash

        serialized_layer_groups =
          ActiveModelSerializers::SerializableResource.new(
            dimension_groups,
            each_serializer: Api::V3::MapLayers::DimensionGroupSerializer,
            root: 'dimensionGroups'
          ).serializable_hash

        serialized_layers =
          ActiveModelSerializers::SerializableResource.new(
            dimensions,
            each_serializer: Api::V3::MapLayers::DimensionSerializer,
            root: 'dimensions'
          ).serializable_hash

        render json: serialized_layer_groups.merge(serialized_layers).
          merge(serialized_contextual_layers)
      end
    end
  end
end
