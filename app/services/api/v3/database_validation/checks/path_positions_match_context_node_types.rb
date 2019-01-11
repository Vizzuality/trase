# Check if positions of nodes in flow paths match declared positions
# in context_node_types.
module Api
  module V3
    module DatabaseValidation
      module Checks
        class PathPositionsMatchContextNodeTypes < AbstractCheck
          # Checks the flows table, expanding paths in a subjquery
          # to get node types for each node and compares
          # node_type_id + position from path versus that declared
          # in context_node_types.
          # @return (see AbstractCheck#passing?)
          def passing?
            @violating_flows = Api::V3::Flow.
              select('a.id').
              from(
                <<~SQL
                  (
                    #{actual_column_positions_subquery.to_sql}
                  ) a
                  LEFT JOIN (
                    #{expected_column_positions_subquery.to_sql}
                  ) e ON a.position = (e.column_position + 1)
                    AND a.node_type_id = e.node_type_id
                SQL
              ).where('e.node_type_id' => nil).
              group('a.id').
              pluck('a.id')
            @violating_flows.none?
          end

          def self.human_readable(_options)
            'declared column positions match data'
          end

          private

          def actual_column_positions_subquery
            Api::V3::Flow.
              select('flows.id', 'a."position"', 'nodes.node_type_id').
              from(
                'flows, LATERAL unnest(flows.path) WITH ORDINALITY a(node_id, "position")'
              ).
              joins('JOIN nodes ON nodes.id = a.node_id').
              where(context_id: @object.id).
              group('flows.id', 'a."position"', 'nodes.node_type_id')
          end

          def expected_column_positions_subquery
            Api::V3::ContextNodeType.select(
              :context_id, :node_type_id, :column_position
            ).where(context_id: @object.id)
          end

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
              'Path node types should match context node types ',
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
