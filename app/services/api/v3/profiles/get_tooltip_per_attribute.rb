module Api
  module V3
    module Profiles
      class GetTooltipPerAttribute
        include ActiveSupport::Configurable

        attr_reader :ro_chart_attribute, :context

        class << self
          def call(ro_chart_attribute:, context:)
            new(
              ro_chart_attribute: ro_chart_attribute,
              context: context
            ).call
          end
        end

        def initialize(ro_chart_attribute:, context:)
          @ro_chart_attribute = ro_chart_attribute
          @attribute = Api::V3::Readonly::Attribute.find_by(
            original_id: ro_chart_attribute[:original_id],
            original_type: ro_chart_attribute[:original_type].capitalize
          )
          @context = context
        end

        def call
          tooltip
        end

        private

        def tooltip
          context_specific_tooltip ||
            country_specific_tooltip ||
            commodity_specific_tooltip ||
            ro_chart_attribute[:tooltip_text]
        end

        def context_specific_tooltip
          @attribute.tooltip_text_by_context_id &&
            @attribute.tooltip_text_by_context_id[@context.id.to_s]
        end

        def country_specific_tooltip
          @attribute.tooltip_text_by_country_id &&
            @attribute.tooltip_text_by_country_id[@context.country_id.to_s]
        end

        def commodity_specific_tooltip
          @attribute.tooltip_text_by_commodity_id &&
            @attribute.tooltip_text_by_commodity_id[@context.commodity_id.to_s]
        end
      end
    end
  end
end
