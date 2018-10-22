module Api
  module V3
    module Dashboards
      class RetrieveAttributes
        # @param params [Hash]
        # @option params [Array<Integer>] countries_ids
        # @option params [Array<Integer>] commodities_ids
        # @option params [Array<Integer>] sources_ids
        # @option params [Array<Integer>] companies_ids
        # @option params [Array<Integer>] destinations_ids
        # @option params [Array<Integer>] node_types_ids
        def initialize(params)
          @countries_ids = params[:countries_ids] || []
          @commodities_ids = params[:commodities_ids] || []
          @nodes_ids = (params[:sources_ids] || []) +
            (params[:companies_ids] || []) +
            (params[:destinations_ids] || [])
          initialize_query
        end

        def call
          @query.all
        end

        private

        def initialize_query
          initialize_flow_attributes_subquery
          initialize_node_attributes_subquery
          @query = Api::V3::Readonly::Attribute.
            from("(#{union_sql}) attributes_mv").
            select(
              :id,
              :display_name,
              :tooltip_text,
              :chart_type,
              :dashboards_attribute_group_id,
              'NOT BOOL_OR(NOT is_disabled) AS is_disabled'
            ).
            group(
              :id,
              :display_name,
              :tooltip_text,
              :chart_type,
              :dashboards_attribute_group_id
            )
        end

        def initialize_flow_attributes_subquery
          @flow_attributes_subquery = initialize_attributes_subquery(:flow)
        end

        def initialize_node_attributes_subquery
          @node_attributes_subquery = initialize_attributes_subquery(:node)
        end

        def initialize_attributes_subquery(attribute_type)
          Api::V3::Readonly::Attribute.
            from("dashboards_#{attribute_type}_attributes_mv attributes_mv").
            select(
              'attribute_id AS id',
              :display_name,
              :tooltip_text,
              :chart_type,
              :dashboards_attribute_group_id,
              case_sql(
                send(:"#{attribute_type}_attributes_conditions_for_case"),
                send(:"#{attribute_type}_attributes_default_for_case")
              )
            ).distinct
        end

        def case_sql(conditions, default)
          return "#{default} AS is_disabled" if conditions.blank?

          <<~SQL
            CASE
              WHEN #{conditions} THEN FALSE
              ELSE TRUE
            END AS is_disabled
          SQL
        end

        def union_sql
          <<~SQL
            #{@flow_attributes_subquery.to_sql}
            UNION
            #{@node_attributes_subquery.to_sql}
          SQL
        end

        def flow_attributes_conditions_for_case
          cond_strs = []
          cond_vals = []
          if @countries_ids.any?
            cond_strs << 'country_id IN (?)'
            cond_vals << @countries_ids
          end
          if @commodities_ids.any?
            cond_strs << 'commodity_id IN (?)'
            cond_vals << @commodities_ids
          end
          if @nodes_ids.any?
            cond_strs << 'path @> ARRAY[?]'
            cond_vals << @nodes_ids
          end
          Api::V3::Readonly::Attribute.send(
            :sanitize_sql_for_conditions,
            [cond_strs.join(' AND '), *cond_vals]
          )
        end

        def flow_attributes_default_for_case
          false
        end

        def node_attributes_conditions_for_case
          return unless @nodes_ids.any?

          Api::V3::Readonly::Attribute.send(
            :sanitize_sql_for_conditions,
            ['node_id IN (?)', @nodes_ids]
          )
        end

        def node_attributes_default_for_case
          @nodes_ids.empty?
        end
      end
    end
  end
end
