# Check if the length of paths matches number of context node types
module Api
  module V3
    module DatabaseValidation
      module Checks
        class PathLengthMatchesContextNodeTypes < AbstractCheck
          include ErrorMessageWithViolatingFlows

          # Checks the flows table
          # @return (see AbstractCheck#passing?)
          def passing?
            expected_length = @object.context_node_types.count
            @violating_flows = @object.flows.
              where("ICOUNT(path) <> ?", expected_length).
              pluck(:id)
            @violating_flows.none?
          end

          def self.human_readable(_options)
            "path length matches context node types"
          end

          private

          def error
            super.merge(
              message: error_message(
                "Path length should match context node types"
              )
            )
          end
        end
      end
    end
  end
end
