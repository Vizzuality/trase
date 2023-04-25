require "active_support/concern"

module Api
  module V3
    module Readonly
      module MaterialisedView
        extend ActiveSupport::Concern

        def readonly?
          false
        end

        class_methods do
          def refresh_by_conditions(_key_conditions1, _key_conditions2, options = {})
            refresh(options)
          end

          protected

          def refresh_by_name(table_name, options)
            safe_concurrently = true
            # rubocop:disable Style/DoubleNegation
            safe_concurrently = !!options[:concurrently] unless options[:concurrently].nil?
            # rubocop:enable Style/DoubleNegation
            is_populated = Api::V3::IsMviewPopulated.new(table_name).call
            # cannot refresh concurrently a view that is not populated
            safe_concurrently = false unless is_populated
            Scenic.database.refresh_materialized_view(
              table_name,
              concurrently: safe_concurrently
            )
          end
        end
      end
    end
  end
end
