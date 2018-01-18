module Api
  module V3
    class CartoLayer < BaseModel
      belongs_to :contextual_layer
    end
  end
end
