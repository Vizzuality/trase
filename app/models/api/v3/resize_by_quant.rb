module Api
  module V3
    class ResizeByQuant < BaseModel
      belongs_to :resize_by_attribute
      belongs_to :quant

      def self.stable_foreign_keys
        [
          {name: :resize_by_attribute_id, table_class: Api::V3::ResizeByAttribute}
        ]
      end

      def self.unstable_foreign_keys
        [
          {name: :quant_id, table_class: Api::V3::Quant}
        ]
      end
    end
  end
end
