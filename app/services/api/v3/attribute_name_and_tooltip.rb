module Api
  module V3
    class AttributeNameAndTooltip
      include ActiveSupport::Configurable

      NameAndTooltip = Struct.new(:display_name, :tooltip_text)

      attr_reader :attribute, :context, :defaults

      class << self
        # @param attribute [Api::V3::Readonly::Attribute]
        # @param context [Api::V3::Context]
        # @param defaults [NameAndTooltip]
        def call(attribute:, context:, defaults:)
          new(
            attribute: attribute,
            context: context,
            defaults: defaults
          ).call
        end
      end

      # @param attribute [Api::V3::Readonly::Attribute]
      # @param context [Api::V3::Context]
      # @param defaults [NameAndTooltip]
      def initialize(attribute:, context:, defaults:)
        @attribute = attribute
        @context = context
        @defaults = defaults
      end

      def call
        NameAndTooltip.new(display_name, tooltip_text)
      end

      private

      def tooltip_text
        context_specific_tooltip_text ||
          country_specific_tooltip_text ||
          commodity_specific_tooltip_text ||
          @defaults.tooltip_text
      end

      def display_name
        context_specific_display_name ||
          country_specific_display_name ||
          commodity_specific_display_name ||
          @defaults.display_name
      end

      def context_specific_tooltip_text
        @attribute.tooltip_text_by_context_id &&
          @attribute.tooltip_text_by_context_id[@context.id.to_s]
      end

      def country_specific_tooltip_text
        @attribute.tooltip_text_by_country_id &&
          @attribute.tooltip_text_by_country_id[@context.country_id.to_s]
      end

      def commodity_specific_tooltip_text
        @attribute.tooltip_text_by_commodity_id &&
          @attribute.tooltip_text_by_commodity_id[@context.commodity_id.to_s]
      end

      def context_specific_display_name
        @attribute.display_name_by_context_id &&
          @attribute.display_name_by_context_id[@context.id.to_s]
      end

      def country_specific_display_name
        @attribute.display_name_by_country_id &&
          @attribute.display_name_by_country_id[@context.country_id.to_s]
      end

      def commodity_specific_display_name
        @attribute.display_name_by_commodity_id &&
          @attribute.display_name_by_commodity_id[@context.commodity_id.to_s]
      end
    end
  end
end
