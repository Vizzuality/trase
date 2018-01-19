module Api
  module V3
    class MapInd < BaseModel
      include Api::V3::Import::YellowTableHelpers

      belongs_to :map_attribute
      belongs_to :ind

      def self.yellow_foreign_keys
        [
          {name: :map_attribute_id, table_class: Api::V3::MapAttribute}
        ]
      end

      def self.blue_foreign_keys
        [
          {name: :ind_id, table_class: Api::V3::Ind}
        ]
      end
    end
  end
end
