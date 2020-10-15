module Api
  module Readonly
    class BaseModel < Api::V3::BaseModel

      def readonly?
        true
      end

      class << self
        # Refreshes the views dependencies, the view itself and its dependents
        # @param options
        # @option options [Boolean] :skip_dependents skip refreshing
        # @option options [Boolean] :sync synchronously
        def refresh(options = {})
          sync_processing =
            unless options[:sync].nil?
              options[:sync]
            else
              # in unspecified, decide based on how long it takes to run
              !long_running?
            end
          if sync_processing
            refresh_now(options)
          else
            refresh_later(options)
          end
        end

        def refresh_now(options = {})
          refresh_by_name(table_name, options)
          after_refresh(options)
          refresh_dependents(options) unless options[:skip_dependents]
        end

        # this materialized view takes a long time to refresh
        def refresh_later(options = {})
          FullRefreshWorker.perform_async(name, options)
        end

        protected

        def long_running?
          false
        end

        # Refreshes materialized views that depend on this view
        def refresh_dependents(options = {}); end

        # Whatever needs doing after refreshing that is not a cascading refresh
        def after_refresh(_options = {}); end
      end
    end
  end
end
