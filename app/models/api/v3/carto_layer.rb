module Api
  module V3
    class CartoLayer < BaseModel
      include Api::V3::Import::YellowTableHelpers

      belongs_to :contextual_layer

      def self.yellow_foreign_keys
        [
          {name: :contextual_layer_id, table_class: Api::V3::ContextualLayer}
        ]
      end
    end
  end
end
