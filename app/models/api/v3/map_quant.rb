module Api
  module V3
    class MapQuant < YellowTable
      belongs_to :map_attribute
      belongs_to :quant

      def self.yellow_foreign_keys
        [
          {name: :map_attribute_id, table_class: Api::V3::MapAttribute}
        ]
      end

      def self.blue_foreign_keys
        [
          {name: :quant_id, table_class: Api::V3::Quant}
        ]
      end
    end
  end
end
