# This service to be used as part of the importer script
# to amend any ids stored in sankey_card_links.query_params
# that might have got out of sync with new numeric identifiers.
module Api
  module V3
    module SankeyCardLinks
      class RefreshQueryParams
        # @param ids_map Hash old id => new id mapping
        # @param query_param_wrappers Hash query param name => wrapper struct
        def initialize(ids_map, query_param_wrappers)
          @ids_map = ids_map
          @query_param_wrappers = query_param_wrappers
        end
        
        def call
          ids_to_replace = @ids_map.select { |k, v| k != v }.keys
          ids_to_keep = @ids_map.values

          Api::V3::SankeyCardLink.all.each do |card|
            query_params = card.query_params
            # iterate through query params
            @query_param_wrappers.each do |qp_name, qp_wrapper|
              # wrapper object to manipulate the value of query param
              query_param_object = qp_wrapper.new(query_params[qp_name])
              next unless query_param_object.to_ary.any?

              # replace changed ids in query param value
              ids_to_replace = query_param_object & ids_to_replace
              if ids_to_replace.any?
                query_param_object.replace!(
                  ids_to_replace, @ids_map.values_at(*ids_to_replace)
                )
              end
              # delete removed ids in query param value
              ids_to_delete = query_param_object - ids_to_keep
              if ids_to_delete.any?
                query_param_object.delete!(ids_to_delete)
              end
              # update query param value
              if query_param_object.value.present?
                query_params[qp_name] = query_param_object.value
              else
                query_params.delete(qp_name)
              end
            end
            card.update_query_params(query_params)
          end
        end
      end
    end
  end
end
