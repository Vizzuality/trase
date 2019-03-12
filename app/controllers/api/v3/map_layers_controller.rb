module Api
  module V3
    class MapLayersController < ApiController
      def index
        ensure_required_param_present(:start_year)
        set_start_end_year

        contextual_layers = Api::V3::MapLayers::ContextualLayerFilter.new(
          @context
        ).call

        dimension_groups = Api::V3::MapAttributeGroup.
          select('DISTINCT name, id, position').
          where(context_id: @context.id).
          order('position ASC, id ASC')

        dimensions = Api::V3::MapLayers::MapAttributeFilter.new(
          @context, @start_year, @end_year
        ).call

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

        serialized_layers = {
          dimensions: dimensions.map do |dimension|
            serialize_dimension(dimension)
          end
        }

        render json: serialized_layer_groups.merge(serialized_layers).
          merge(serialized_contextual_layers)
      end

      private

      def set_start_end_year
        @start_year = params[:start_year]&.to_i || @context&.default_year
        @end_year = params[:end_year]&.to_i || @start_year
      end

      def serialize_dimension(dimension)
        # rubocop:disable Style/EachWithObject
        dimension.inject({}) do |new_hash, (k, v)|
          new_hash[k.camelize(:lower)] = v
          new_hash
        end
        # rubocop:enable Style/EachWithObject
      end
    end
  end
end
