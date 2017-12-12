module Api
  module V3
    class QualProperty < BaseModel
      include AttributePropertiesProfileScopes

      belongs_to :qual
    end
  end
end
