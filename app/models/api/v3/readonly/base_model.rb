module Api
  module V3
    module Readonly
      class BaseModel < Api::V3::BaseModel
        def readonly?
          true
        end

        # Refreshes the views dependencies, the view itself and its dependents
        # @param options
        # @option options [Boolean] :skip_dependencies skip refreshing
        def self.refresh(options = {})
          # TODO: test the new :cascade options
          refresh_dependencies unless options[:skip_dependencies]
          refresh_by_name(table_name, options)
          refresh_dependents(options)
        end

        def self.refresh_by_name(table_name, options)
          # rubocop:disable Style/DoubleNegation
          safe_concurrently = !!options[:concurrently]
          # rubocop:enable Style/DoubleNegation
          is_populated = IsMviewPopulated.new(table_name).call
          # cannot refresh concurrently a view that is not populated
          safe_concurrently = false unless is_populated
          Scenic.database.refresh_materialized_view(
            table_name,
            concurrently: safe_concurrently
          )
        end

        # Refreshes materialized views this view depends on
        def self.refresh_dependencies(options = {}); end

        # Refreshes materialized views that depend on this view
        def self.refresh_dependents(options = {}); end
      end
    end
  end
end
