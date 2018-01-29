module Api
  module V3
    class CountryProperty < YellowTable
      belongs_to :country

      validates :country, presence: true, uniqueness: true
      validates :latitude, presence: true
      validates :longitude, presence: true
      validates :zoom, presence: true, inclusion: { in: 0..18 }

      def self.blue_foreign_keys
        [
          {name: :country_id, table_class: Api::V3::Country}
        ]
      end
    end
  end
end
