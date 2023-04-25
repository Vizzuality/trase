# https://pawelurbanek.com/active-admin-tips-optimizations
module Api
  module V3
    module NullifyBlankValues
      extend ActiveSupport::Concern

      included do
        before_save :nullify_blank_values
      end

      def nullify_blank_values
        begin
          self.class.const_get("NORMALIZABLE_ATTRIBUTES")
        rescue NameError
          []
        end.each do |column|
          self[column].present? || self[column] = nil
        end
      end
    end
  end
end
