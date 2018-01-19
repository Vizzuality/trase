module Api
  module V3
    class CountryProperty < BaseModel
      include Api::V3::Import::YellowTableHelpers

      belongs_to :country

      def self.blue_foreign_keys
        [
          {name: :country_id, table_class: Api::V3::Country}
        ]
      end
    end
  end
end
