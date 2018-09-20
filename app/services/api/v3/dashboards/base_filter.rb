module Api
  module V3
    module Dashboards
      class BaseFilter
        # @param (see FilterFlowPaths#initialize)
        def initialize(params)
          @flow_paths_filter = FilterFlowPaths.new(params)
          initialize_query
        end

        def call
          filter_by_flows
          @query
        end

        private

        # @abstract
        # @return [ActiveRecord::Relation]
        # @raise [NotImplementedError] when not defined in subclass
        def initialize_query
          raise NotImplementedError
        end

        def filter_by_flows
          return unless @flow_paths_filter.filtered?

          flow_ids = @flow_paths_filter.call.select(:flow_id).distinct
          @query = @query.where(flow_id: flow_ids)
        end
      end
    end
  end
end
