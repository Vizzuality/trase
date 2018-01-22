module Api
  module V3
    class YellowTable < BaseModel
      include Api::V3::Import::YellowTableHelpers
      self.abstract_class = true
    end
  end
end
