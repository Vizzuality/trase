module Api
  module V3
    class QualProperty < BaseModel
      include AttributePropertiesProfileScopes
      include Api::V3::Import::YellowTableHelpers

      belongs_to :qual

      def self.blue_foreign_keys
        [
          {name: :qual_id, table_class: Api::V3::Qual}
        ]
      end
    end
  end
end
