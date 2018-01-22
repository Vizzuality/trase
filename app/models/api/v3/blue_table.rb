module Api
  module V3
    class BlueTable < BaseModel
      include Api::V3::Import::BlueTableHelpers
      self.abstract_class = true
    end
  end
end
