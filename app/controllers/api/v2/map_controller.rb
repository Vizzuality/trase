module Api
  module V2
    class MapController < V2ApplicationController

      def index
        dimension_groups = ContextLayerGroup.select('distinct name, context_layer_group.id as id, context_layer_group.position')
                               .joins('LEFT JOIN context_layer ON context_layer.context_layer_group_id = context_layer_group.id')
                               .where('context_layer_group.context_id = :context_id', context_id: @context.id)
                               .order('context_layer_group.position ASC, context_layer_group.id ASC')

        dimensions = ContextLayer.select('context_layer.id as id, context_layer.color_scale as color_scale, layer_attribute_id, COALESCE (inds.frontend_name, quants.frontend_name) as name, COALESCE (inds.tooltip_text, quants.tooltip_text) as description, lower(layer_attribute_type::text) as type, bucket_3, bucket_5, context_layer.context_layer_group_id as group_id, COALESCE (inds.unit, quants.unit) as unit, is_default, years, aggregate_method')
                         .joins('LEFT JOIN context_layer_group ON context_layer.context_layer_group_id = context_layer_group.id')
                         .joins('LEFT JOIN quants ON layer_attribute_type =\'Quant\' AND layer_attribute_id = quants.quant_id')
                         .joins('LEFT JOIN inds ON layer_attribute_type =\'Ind\' AND layer_attribute_id = inds.ind_id')
                         .where('context_layer.context_id = :context_id', context_id: @context.id)
                         .where('context_layer.enabled = true')
                         .order('context_layer.position ASC')


        serialized_layer_groups = ActiveModelSerializers::SerializableResource.new(dimension_groups, {each_serializer: DimensionGroupSerializer, root: 'dimensionGroups'}).serializable_hash
        serialized_layers = ActiveModelSerializers::SerializableResource.new(dimensions, {each_serializer: DimensionSerializer, root: 'dimensions'}).serializable_hash

        render json: serialized_layer_groups.merge(serialized_layers)
      end

    end
  end
end
