module Api
  module V3
    class RecolorByInd < BaseModel
      belongs_to :recolor_by_attribute
      belongs_to :ind
    end
  end
end
