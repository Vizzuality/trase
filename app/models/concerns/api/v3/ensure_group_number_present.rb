module Api
  module V3
    module EnsureGroupNumberPresent
      extend ActiveSupport::Concern

      included do
        before_validation :ensure_group_number_present
      end

      def ensure_group_number_present
        return if group_number.present?

        max_group_number = others_in_context.map(&:group_number).max || 1
        self.group_number = max_group_number
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
