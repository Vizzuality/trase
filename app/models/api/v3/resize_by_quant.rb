module Api
  module V3
    class ResizeByQuant < BaseModel
      belongs_to :resize_by_attribute
      belongs_to :quant
    end
  end
end
