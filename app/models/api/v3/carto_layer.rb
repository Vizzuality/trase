module Api
  module V3
    class CartoLayer < YellowTable
      include Api::V3::StringyArray

      belongs_to :contextual_layer

      validates :contextual_layer, presence: true
      validates :identifier, presence: true, uniqueness: {scope: :contextual_layer}

      stringy_array :years

      def self.yellow_foreign_keys
        [
          {name: :contextual_layer_id, table_class: Api::V3::ContextualLayer}
        ]
      end
    end
  end
end
