module Api
  module V3
    class RecolorByQual < BaseModel
      belongs_to :recolor_by_attribute
      belongs_to :qual

      def self.stable_foreign_keys
        [
          {name: :recolor_by_attribute_id, table_class: Api::V3::RecolorByAttribute}
        ]
      end

      def self.unstable_foreign_keys
        [
          {name: :qual_id, table_class: Api::V3::Qual}
        ]
      end
    end
  end
end
