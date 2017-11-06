module Api
  module V3
    class Country < BaseModel
      has_many :contexts
    end
  end
end
