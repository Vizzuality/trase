module Api
  module V3
    class IndProperty < YellowTable
      include AttributePropertiesProfileScopes

      belongs_to :ind

      def self.blue_foreign_keys
        [
          {name: :ind_id, table_class: Api::V3::Ind}
        ]
      end
    end
  end
end
