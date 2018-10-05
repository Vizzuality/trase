module Api
  module V3
    module Readonly
      class BaseModel < Api::V3::BaseModel
        def readonly?
          true
        end

        class << self
          # Refreshes the views dependencies, the view itself and its dependents
          # @param options
          # @option options [Boolean] :skip_dependencies skip refreshing
          def refresh(options = {})
            # rubocop:disable Style/DoubleNegation
            sync_processing = !!options[:sync]
            # rubocop:enable Style/DoubleNegation
            if long_running? && !sync_processing
              refresh_later(options)
            else
              refresh_now(options)
            end
          end

          def refresh_now(options = {})
            refresh_dependencies unless options[:skip_dependencies]
            refresh_by_name(table_name, options)
            refresh_dependents(options) unless options[:skip_dependents]
          end

          # this materialized view takes a long time to refresh
          def refresh_later(options = {})
            MaterializedViewRefreshWorker.perform_async(name, options)
          end

          private

          def long_running?
            false
          end

          # Refreshes materialized views this view depends on
          def refresh_dependencies(options = {}); end

          # Refreshes materialized views that depend on this view
          def refresh_dependents(options = {}); end

          def refresh_by_name(table_name, options)
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
        end
      end
    end
  end
end
