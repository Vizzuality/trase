module Api
  module V3
    class Chart < BaseModel
      include Api::V3::Import::YellowTableHelpers

      def self.yellow_foreign_keys
        [
          {name: :profile_id, table_class: Api::V3::Profile}
        ]
      end
    end
  end
end
