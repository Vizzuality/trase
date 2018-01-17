module Api
  module V3
    class CountryProperty < BaseModel
      belongs_to :country

      def self.unstable_foreign_keys
        [
          {name: :country_id, table_class: Api::V3::Country}
        ]
      end
    end
  end
end
