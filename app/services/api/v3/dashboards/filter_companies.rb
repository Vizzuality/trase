module Api
  module V3
    module Dashboards
      class FilterCompanies < BaseFilter
        include CallWithQueryTerm

        def initialize(params)
          @self_ids = params.delete(:companies_ids)
          @nodes_to_filter_by = Api::V3::Dashboards::NodesToFilterBy.new(params)
          super(params)
        end

        def call_with_query_term(query_term)
          super(query_term, {include_country_id: true})
        end

        private

        def initialize_query
          # to find all the matching paths, we need to look at node types
          # of the nodes we're filtering by
          # and for each node type we check that the path matches at least
          # one selected node
          # e.g. if someone selected 3 municipalities and 3 destinations
          # we look for flows where path matches ANY of the 3 municipalities
          # AND ANY of the 3 destinatons
          # no path can match more than pone node id of a given node type
          path_conditions = @nodes_to_filter_by.node_types_ids.map do |node_type_id|
            nodes = @nodes_to_filter_by.nodes_by_node_type_id(node_type_id)
            "flows.path && ARRAY[#{nodes.map(&:id).join(', ')}]"
          end.join(' AND ')

          # get a list of all matching nodes without checking role / position
          # because that's more complicated and identical performance-wise
          # also, ignore the context here - that's going to be filtered out
          # by the countries / commodities ids (I hope)
          nodes_on_matching_paths = Api::V3::Flow.
            select('UNNEST(path) AS node_id').
            where(path_conditions).
            distinct

          @query = Api::V3::Readonly::Dashboards::Company.
            joins(
              "JOIN (#{nodes_on_matching_paths.to_sql}) s ON s.node_id = dashboards_companies_mv.id"
            ).
            select(
              :id,
              :name,
              :node_type,
              :node_type_id,
              :country_id
            ).
            group(
              :id,
              :name,
              :node_type,
              :node_type_id,
              :country_id
            ).
            order(:name)
        end
      end
    end
  end
end
