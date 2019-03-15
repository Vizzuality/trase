module Api
  module V3
    module MapLayers
      # GetTooltipPerAttribute service expects an attribute with certain keys:
      # tooltip_text, original_id and original_type
      # This module prepares the map attribute to meet the service's format
      class MapAttributeNormalizer
        attr_reader :map_attribute

        class << self
          def call(map_attribute)
            new(
              map_attribute
            ).call
          end
        end

        def initialize(map_attribute)
          @map_attribute = map_attribute
        end

        def call
          {
            tooltip_text: map_attribute['description'],
            original_id: map_attribute['layer_attribute_id'],
            original_type: map_attribute['type']
          }
        end
      end
    end
  end
end
