# Check if the length of paths matches number of context node types
module Api
  module V3
    module DatabaseValidation
      module Checks
        class PathMatchesContextNodeTypes < AbstractCheck
          # Checks the flows table
          # @return (see AbstractCheck#passing?)
          def passing?
            expected_length = @object.context_node_types.count
            @violating_flows_cnt = @object.flows.
              where('ICOUNT(path) <> ?', expected_length).count
            @violating_flows_cnt.zero?
          end

          def self.human_readable(_options)
            'path length matches context node types'
          end

          private

          def error
            message = [
              'Path length should match context node types (',
              @violating_flows_cnt,
              'violating flows)'
            ].join(' ')
            super.merge(
              message: message
            )
          end
        end
      end
    end
  end
end
