module Api
  module V3
    class CountriesWbIndicator < BaseModel
      validates :iso_code, presence: true
      validates :year, presence: true
      validates :name, presence: true, uniqueness: {scope: [:iso_code, :year]}
      validates :value, presence: true
      validates :rank, presence: true
    end
  end
end
