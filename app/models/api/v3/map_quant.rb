module Api
  module V3
    class MapQuant < BaseModel
      belongs_to :map_attribute
      belongs_to :quant
    end
  end
end
