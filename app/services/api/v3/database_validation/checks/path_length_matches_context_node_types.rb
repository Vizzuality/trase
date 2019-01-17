# Check if the length of paths matches number of context node types
module Api
  module V3
    module DatabaseValidation
      module Checks
        class PathLengthMatchesContextNodeTypes < AbstractCheck
          # Checks the flows table
          # @return (see AbstractCheck#passing?)
          def passing?
            expected_length = @object.context_node_types.count
            @violating_flows = @object.flows.
              where('ICOUNT(path) <> ?', expected_length).
              pluck(:id)
            @violating_flows.none?
          end

          def self.human_readable(_options)
            'path length matches context node types'
          end

          private

          def error
            violating_ids, n_more =
              if @violating_flows.size > 10
                [@violating_flows[0..9], @violating_flows.size - 10]
              else
                [@violating_flows, nil]
              end
            violating_ids_message = violating_ids.join(', ')
            violating_ids_message += " and #{n_more} more" if n_more

            message = [
              'Path length should match context node types ',
              '(violating flows ids: ',
              violating_ids_message,
              ')'
            ].join('')
            super.merge(
              message: message
            )
          end
        end
      end
    end
  end
end
