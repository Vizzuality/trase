module Api
  module V3
    class QualProperty < BaseModel
      include AttributePropertiesProfileScopes

      belongs_to :qual

      def self.unstable_foreign_keys
        [
          {name: :qual_id, table_class: Api::V3::Qual}
        ]
      end
    end
  end
end
