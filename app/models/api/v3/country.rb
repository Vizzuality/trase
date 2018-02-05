module Api
  module V3
    class Country < BlueTable
      has_one :country_property
      has_many :contexts

      delegate :latitude, to: :country_property
      delegate :longitude, to: :country_property
      delegate :zoom, to: :country_property

      validates :name, presence: true
      validates :iso2, presence: true, uniqueness: true

      def self.import_key
        [
          {name: :iso2, sql_type: 'TEXT'}
        ]
      end
    end
  end
end
