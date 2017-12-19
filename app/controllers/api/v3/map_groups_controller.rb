module Api
  module V3
    class MapGroupsController < ApiController
      def index
        dimension_groups = Api::V3::MapAttributeGroup.select('distinct name, id, position').
          where(context_id: @context.id).
          order('position ASC, id ASC')

        dimensions = Api::V3::Readonly::MapAttribute.select("color_scale, \
#{Api::V3::Readonly::MapAttribute.table_name}.id, bucket_3, bucket_5, \
map_attribute_group_id as group_id, is_default, years, \
#{Api::V3::Readonly::MapAttribute.table_name}.name, attribute_type as type, \
unit, description, aggregate_method, original_attribute_id AS layer_attribute_id, \
map_attribute_group_id as group_id").
          joins(:map_attribute_group).
          where(
            is_disabled: false,
            "#{Api::V3::MapAttributeGroup.table_name}.context_id": @context.id
          ).
          order(position: :asc)

        serialized_layer_groups = ActiveModelSerializers::SerializableResource.new(dimension_groups, each_serializer: DimensionGroupSerializer, root: 'dimensionGroups').serializable_hash
        serialized_layers = ActiveModelSerializers::SerializableResource.new(dimensions, each_serializer: DimensionSerializer, root: 'dimensions').serializable_hash

        render json: serialized_layer_groups.merge(serialized_layers)
      end
    end
  end
end
