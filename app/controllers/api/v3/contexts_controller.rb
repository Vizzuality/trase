module Api
  module V3
    class ContextsController < ApiController
      skip_before_action :load_context

      def index
        @contexts = Api::V3::Context.
          includes(
            :country, :commodity, :context_property,
            readonly_recolor_by_attributes: :readonly_attribute,
            readonly_resize_by_attributes: :readonly_attribute,
            context_node_types: :node_type,
            context_node_types: :profile
          ).
          references(:context_property).
          where('NOT context_properties.is_disabled').
          select(&:is_visible?)

        render json: @contexts, root: 'data',
               each_serializer: Api::V3::Contexts::ContextSerializer
      end
    end
  end
end
