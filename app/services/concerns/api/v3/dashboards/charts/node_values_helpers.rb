module Api
  module V3
    module Dashboards
      module Charts
        module NodeValuesHelpers
          private

          def temporal?
            @cont_attribute.temporal?(@context)
          end

          def node_filter
            node_type = @node.node_type
            profile = profile_for_node_type_id(@node.node_type_id)
            {
              node: {
                id: @node.id,
                name: @node.name,
                node_type_id: node_type.id,
                node_type: node_type.name,
                profile: profile
              }
            }
          end

          def info
            {
              temporal: temporal?,
              years: {
                start_year: @start_year || @year,
                end_year: @end_year
              },
              filter: {
                cont_attribute: @cont_attribute.try(:display_name)
              }.merge(node_filter)
            }
          end
        end
      end
    end
  end
end
