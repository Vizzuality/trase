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
                    :nodes_ids

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
            @context = Api::V3::Context.find_by_country_id_and_commodity_id!(
              @country_id, @commodity_id
            )
          end

          initialize_cont_attribute params[:cont_attribute_id]
          initialize_ncont_attribute params[:ncont_attribute_id]

          @sources_ids = params[:sources_ids] || []
          @companies_ids = params[:companies_ids] || []
          @destinations_ids = params[:destinations_ids] || []
          @nodes_ids = @sources_ids + companies_ids + destinations_ids

          @start_year = params[:start_year]
          @end_year = params[:end_year]
        end

        private

        def initialize_cont_attribute(cont_attribute_id)
          return unless cont_attribute_id.present?

          resize_by_attribute = Api::V3::Readonly::ResizeByAttribute.
            select(:attribute_id).
            includes(:readonly_attribute).
            find_by_context_id_and_attribute_id!(
              @context.id, cont_attribute_id
            )
          raise ActiveRecord::RecordNotFound unless resize_by_attribute

          @cont_attribute = resize_by_attribute.readonly_attribute
        end

        def initialize_ncont_attribute(ncont_attribute_id)
          return unless ncont_attribute_id.present?

          recolor_by_attribute = Api::V3::Readonly::RecolorByAttribute.
            select(:attribute_id).
            includes(:readonly_attribute).
            find_by_context_id_and_attribute_id!(
              @context.id, ncont_attribute_id
            )
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
