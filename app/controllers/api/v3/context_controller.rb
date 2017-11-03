module Api
  module V3
    class ContextController < V3ApplicationController
      def get_contexts

        @contexts = Api::V3::Context
                        .includes(:country, :commodity, :contextual_layers, m_recolor_by_attributes: :m_attribute, m_resize_by_attributes: :m_attribute)
                        .all()

        render json: @contexts, root: 'data', each_serializer: Api::V3::GetContexts::ContextSerializer
      end
    end
  end
end
