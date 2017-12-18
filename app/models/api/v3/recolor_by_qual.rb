module Api
  module V3
    class RecolorByQual < BaseModel
      belongs_to :recolor_by_attribute
      belongs_to :qual
    end
  end
end
