module Api
  module V3
    class QuantProperty < BaseModel
      include AttributePropertiesProfileScopes

      belongs_to :quant
    end
  end
end
