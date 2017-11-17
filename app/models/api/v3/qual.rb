module Api
  module V3
    class Qual < BaseModel
      has_one :qual_property
    end
  end
end
