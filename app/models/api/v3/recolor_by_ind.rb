module Api
  module V3
    class RecolorByInd < BaseModel
      belongs_to :recolor_by_attribute
      belongs_to :ind

      def self.stable_foreign_keys
        [
          {name: :recolor_by_attribute_id, table_class: Api::V3::RecolorByAttribute}
        ]
      end

      def self.unstable_foreign_keys
        [
          {name: :ind_id, table_class: Api::V3::Ind}
        ]
      end
    end
  end
end
