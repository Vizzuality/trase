module Api
  module V3
    module Dashboards
      class FilterCompanies < BaseFilter
        include CallWithQueryTerm

        def initialize(params)
          @self_ids = params.delete(:companies_ids)
          super(params)
        end

        def call
          return @query if @node_ids.none?

          @query = Api::V3::Readonly::Dashboards::Company.
            select(
              'companies.id',
              'companies.name',
              'companies.node_type',
              'companies.node_type_id',
              'companies.country_id',
              'companies.profile',
              'companies.commodity_id'
            ).
            from("(#{@query.to_sql}) AS companies").
            joins('INNER JOIN contexts ON contexts.country_id = companies.country_id AND
                                          contexts.commodity_id = companies.commodity_id').
            joins("INNER JOIN flows ON flows.context_id = contexts.id AND
                                       flows.path @> ARRAY[#{@node_ids.join(', ')}, companies.id]").
            group(
              'companies.id',
              'companies.name',
              'companies.node_type',
              'companies.node_type_id',
              'companies.country_id',
              'companies.profile',
              'companies.commodity_id'
            )
        end

        private

        def initialize_query
          @query = Api::V3::Readonly::Dashboards::Company.
            select(
              :id,
              :name,
              :node_type,
              :node_type_id,
              :country_id,
              :profile,
              :commodity_id
            ).
            group(
              :id,
              :name,
              :node_type,
              :node_type_id,
              :country_id,
              :profile,
              :commodity_id
            ).
            order(:name)

          return if @node_ids.none?

          @query = @query.
            having("COUNT(DISTINCT dashboards_companies_mv.node_id) = #{@node_ids.size}")
        end
      end
    end
  end
end
