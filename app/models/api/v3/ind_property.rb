module Api
  module V3
    class IndProperty < BaseModel
      include AttributePropertiesProfileScopes

      belongs_to :ind
    end
  end
end
