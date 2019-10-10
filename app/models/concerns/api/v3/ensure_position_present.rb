module Api
  module V3
    module EnsurePositionPresent
      extend ActiveSupport::Concern

      included do
        before_validation :ensure_position_correct
      end

      def ensure_position_correct
        return unless context.present?

        others_positions = others_in_context.map(&:position)
        duplicated = others_positions.include?(position)
        return if position.present? && !duplicated

        max_position = (others_positions.max || 0) + 1
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
