module Api
  module V3
    class NodeTypeTabs
      # @param params [Hash]
      # @option params [Array<Integer>] countries_ids
      # @option params [Array<Integer>] commodities_ids
      # @option params [Boolean] profile_only
      # @option params [Array<String>] include: extra columns to include
      # e.g. profile_type, property_prefix
      def initialize(params)
        @countries_ids = params[:countries_ids] || []
        @commodities_ids = params[:commodities_ids] || []
        query =
          if params[:profile_only]
            initialize_profiles_query
          else
            initialize_dashboards_query
          end
        tabs = query.map do |cnt|
          attributes = cnt.attributes.slice(
            *(%w(id name role) + (params[:include] || []))
          )
          attributes.symbolize_keys!
          attributes
        end
        @map = tabs.uniq { |cnt| cnt[:id] }.group_by { |cnt| cnt[:role] }
      end

      def call(role)
        @map[role] || []
      end

      private

      def initialize_profiles_query
        base_query.joins(:profile)
      end

      def initialize_dashboards_query
        base_query.
          left_joins(:profile).
          where.not('node_types.name' => NodeTypeName::COUNTRY_OF_PRODUCTION)
      end

      def base_query
        query = Api::V3::ContextNodeType.
          select(
            'node_types.id',
            'node_types.name',
            'profiles.name AS profile_type',
            'context_node_type_properties.prefix',
            'context_node_type_properties.role'
          ).
          joins(:context, :node_type, :context_node_type_property).
          order(:column_position)

        if @countries_ids.any?
          query = query.where('contexts.country_id' => @countries_ids)
        end
        if @commodities_ids.any?
          query = query.where('contexts.commodity_id' => @commodities_ids)
        end

        query
      end
    end
  end
end
