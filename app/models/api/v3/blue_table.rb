# See the README file for info on what's a blue table
module Api
  module V3
    class BlueTable < BaseModel
      include Api::V3::Import::BlueTableHelpers
      self.abstract_class = true
    end
  end
end
