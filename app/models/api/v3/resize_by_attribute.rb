module Api
  module V3
    class ResizeByAttribute < BaseModel
      belongs_to :context
      has_many :resize_by_quants
    end
  end
end
