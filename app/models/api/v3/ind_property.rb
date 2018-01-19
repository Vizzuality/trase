module Api
  module V3
    class IndProperty < BaseModel
      include AttributePropertiesProfileScopes
      include Api::V3::Import::YellowTableHelpers

      belongs_to :ind

      def self.blue_foreign_keys
        [
          {name: :ind_id, table_class: Api::V3::Ind}
        ]
      end
    end
  end
end
