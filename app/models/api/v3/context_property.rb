module Api
  module V3
    class ContextProperty < BaseModel
      belongs_to :context
    end
  end
end
