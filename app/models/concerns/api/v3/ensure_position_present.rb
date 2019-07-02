module Api
  module V3
    module EnsurePositionPresent
      extend ActiveSupport::Concern

      included do
        before_validation :ensure_position_present
      end

      def ensure_position_present
        return if position.present?

        max_position = others_in_context.map(&:position).max || 1
        self.position = max_position
      end

      def others_in_context
        return @others_in_context if defined?(@others_in_context)

        collection_name = model_name.element.pluralize
        tmp = context.send(collection_name)
        tmp = tmp.where.not(id: id) if persisted?
        @others_in_context = tmp.all
      end
    end
  end
end
