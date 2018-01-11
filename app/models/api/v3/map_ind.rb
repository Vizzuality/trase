module Api
  module V3
    class MapInd < BaseModel
      belongs_to :map_attribute
      belongs_to :ind
    end
  end
end
