module Api
  module V3
    class Commodity < BaseModel
      has_many :contexts
    end
  end
end
