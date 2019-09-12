module Api
  module V3
    module Dashboards
      class BaseFilter
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
          @node_ids = (params[:sources_ids] || []) +
            (params[:companies_ids] || []) +
            (params[:destinations_ids] || [])
          @node_types_ids = params[:node_types_ids] || []
          @profile_only = params.delete(:profile_only) || false
          @self_ids ||= []
          initialize_query
          apply_filters
        end

        def call
          @query
        end

        private

        # @abstract
        # @return [ActiveRecord::Relation]
        # @raise [NotImplementedError] when not defined in subclass
        def initialize_query
          raise NotImplementedError
        end

        def apply_filters
          adjust_node_filters
          filter_by_countries
          filter_by_commodities
          filter_by_nodes
          filter_by_node_types
          filter_by_profile_only
          filter_by_self
        end

        def adjust_node_filters
          return unless @self_ids.any? && @node_types_ids.any?

          # nodes that don't match selected node type
          self_nodes_to_filter_by = Api::V3::Node.where(id: @self_ids).
            reject do |node|
              @node_types_ids.include? node.node_type_id
            end
          self_ids_to_filter_by = self_nodes_to_filter_by.map(&:id)
          @self_ids -= self_ids_to_filter_by
          @node_ids += self_ids_to_filter_by
        end

        def filter_by_countries
          return unless @countries_ids.any?

          @query = @query.where(country_id: @countries_ids)
        end

        def filter_by_commodities
          return unless @commodities_ids.any?

          @query = @query.where(commodity_id: @commodities_ids)
        end

        def filter_by_nodes
          return unless @node_ids.any?

          @query = @query.where(node_id: @node_ids)
        end

        def filter_by_node_types
          return unless @node_types_ids.any?

          @query = @query.where(node_type_id: @node_types_ids)
        end

        def filter_by_profile_only
          return unless @profile_only

          @query = @query.where.not(profile: nil)
        end

        def filter_by_self
          return unless @self_ids.any?

          @query = @query.where(id: @self_ids)
        end
      end
    end
  end
end
