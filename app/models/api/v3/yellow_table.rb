# See the README file for info on what's a yellow table
module Api
  module V3
    class YellowTable < BaseModel
      include Api::V3::Import::YellowTableHelpers
      include Api::V3::NullifyBlankValues
      self.abstract_class = true
    end
  end
end
