module Api
  module V3
    class ResizeByQuant < BaseModel
      include Api::V3::Import::YellowTableHelpers

      belongs_to :resize_by_attribute
      belongs_to :quant

      def self.yellow_foreign_keys
        [
          {name: :resize_by_attribute_id, table_class: Api::V3::ResizeByAttribute}
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
