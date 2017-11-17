module Api
  module V3
    class CountryProperty < BaseModel
      belongs_to :country
    end
  end
end
