module Api
  module V3
    module Dashboards
      class ChartParameters
        attr_reader :country_id,
                    :commodity_id,
                    :context,
                    :cont_attribute,
                    :ncont_attribute,
                    :start_year,
                    :end_year,
                    :sources_ids,
                    :companies_ids,
                    :destinations_ids,
                    :nodes_ids_by_position

        # @param params [Hash]
        # @option params [Integer] country_id
        # @option params [Integer] commodity_id
        # @option params [Integer] cont_attribute_id
        # @option params [Integer] ncont_attribute_id
        # @option params [Array<Integer>] sources_ids
        # @option params [Array<Integer>] companies_ids
        # @option params [Array<Integer>] destinations_ids
        # @option params [Integer] start_year
        # @option params [Integer] end_year
        def initialize(params)
          @country_id = params[:country_id]
          @commodity_id = params[:commodity_id]

          if @country_id && @commodity_id
            @context = Api::V3::Context.where(
              country_id: @country_id, commodity_id: @commodity_id
            ).first
          end
          raise ActiveRecord::RecordNotFound unless @context

          initialize_cont_attribute params[:cont_attribute_id]
          initialize_ncont_attribute params[:ncont_attribute_id]

          @sources_ids = params[:sources_ids] || []
          @companies_ids = params[:companies_ids] || []
          @destinations_ids = params[:destinations_ids] || []
          ids_to_positions = Hash[
            @context.context_node_types.
              select(:node_type_id, :column_position).map do |cnt|
              [cnt.node_type_id, cnt.column_position]
            end
          ]
          @nodes_ids_by_position = Api::V3::Node.select(:id, :node_type_id).
            where(
              id: @sources_ids + @companies_ids + @destinations_ids
            ).includes(:node_type).group_by do |node|
              ids_to_positions[node.node_type_id]
            end

          @start_year = params[:start_year]
          @end_year = params[:end_year]
        end

        private

        def initialize_cont_attribute(cont_attribute_id)
          return unless cont_attribute_id.present?

          resize_by_attribute = Api::V3::Readonly::ResizeByAttribute.
            select(:attribute_id).
            where(context_id: @context.id, attribute_id: cont_attribute_id).
            includes(:readonly_attribute).
            first
          raise ActiveRecord::RecordNotFound unless resize_by_attribute

          @cont_attribute = resize_by_attribute.readonly_attribute
        end

        def initialize_ncont_attribute(ncont_attribute_id)
          return unless ncont_attribute_id.present?

          recolor_by_attribute = Api::V3::Readonly::RecolorByAttribute.
            select(:attribute_id).
            where(context_id: @context.id, attribute_id: ncont_attribute_id).
            includes(:readonly_attribute).
            first
          raise ActiveRecord::RecordNotFound unless recolor_by_attribute

          @ncont_attribute = recolor_by_attribute.readonly_attribute
        end

        def single_year?
          @start_year.present? && @end_year.present? && @start_year == @end_year
        end

        def ncont_attribute?
          @ncont_attribute.present?
        end
      end
    end
  end
end
