module Api
  module V3
    class RecolorByAttribute < BaseModel
      belongs_to :context

      has_many :recolor_by_inds
      has_many :recolor_by_quals
    end
  end
end
