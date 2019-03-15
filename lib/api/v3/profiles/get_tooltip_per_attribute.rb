module Api
  module V3
    module Profiles
      class GetTooltipPerAttribute
        include ActiveSupport::Configurable

        attr_reader :ro_chart_attribute, :context

        config_accessor :context_specific_property do
          Api::V3::Readonly::ContextAttributeProperty
        end

        config_accessor :country_specific_property do
          Api::V3::Readonly::CountryAttributeProperty
        end

        config_accessor :commodity_specific_property do
          Api::V3::Readonly::CommodityAttributeProperty
        end

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

        def attribute
          "#{ro_chart_attribute[:original_type].downcase}_id".to_sym
        end

        def context_specific_tooltip
          context_specific_prop = context_specific_property.
            find_by(attribute => ro_chart_attribute[:original_id],
                    context_id: context.id)
          context_specific_prop.tooltip_text unless context_specific_prop.blank?
        end

        def country_specific_tooltip
          country_specific_prop = country_specific_property.
            find_by(attribute => ro_chart_attribute[:original_id],
                    country_id: context.country_id)
          country_specific_prop.tooltip_text unless country_specific_prop.blank?
        end

        def commodity_specific_tooltip
          commodity_specific_prop = commodity_specific_property.
            find_by(attribute => ro_chart_attribute[:original_id],
                    commodity_id: context.commodity_id)
          commodity_specific_prop.tooltip_text unless commodity_specific_prop.blank?
        end
      end
    end
  end
end
