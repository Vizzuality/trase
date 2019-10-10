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
          # @option options [Boolean] :skip_dependents skip refreshing
          # @option options [Boolean] :sync synchronously
          def refresh(options = {})
            sync_processing = options[:sync]
            # in unspecified, decide based on how long it takes to run
            sync_processing ||= !long_running?
            if sync_processing
              refresh_now(options)
            else
              refresh_later(options)
            end
          end

          def refresh_now(options = {})
            refresh_dependencies(options) unless options[:skip_dependencies]
            refresh_by_name(table_name, options)
            after_refresh(options)
            refresh_dependents(options) unless options[:skip_dependents]
          end

          # this materialized view takes a long time to refresh
          def refresh_later(options = {})
            MaterializedViewRefreshWorker.perform_async(name, options)
          end

          protected

          def long_running?
            false
          end

          def unique_index?
            true
          end

          # Refreshes materialized views this view depends on
          def refresh_dependencies(options = {}); end

          # Refreshes materialized views that depend on this view
          def refresh_dependents(options = {}); end

          def refresh_by_name(table_name, options)
            safe_concurrently = true
            # rubocop:disable Style/DoubleNegation
            safe_concurrently = !!options[:concurrently] unless options[:concurrently].nil?
            # rubocop:enable Style/DoubleNegation
            is_populated = Api::V3::IsMviewPopulated.new(table_name).call
            # cannot refresh concurrently a view that is not populated
            safe_concurrently = false unless is_populated and unique_index?
            Scenic.database.refresh_materialized_view(
              table_name,
              concurrently: safe_concurrently
            )
          end

          # Whatever needs doing after refreshing that is not a cascading refresh
          def after_refresh(_options = {}); end
        end
      end
    end
  end
end
