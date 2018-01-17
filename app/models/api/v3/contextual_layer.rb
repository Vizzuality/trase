module Api
  module V3
    class ContextualLayer < BaseModel
      belongs_to :context

      has_many :carto_layers

      scope :default, -> { where(is_default: true) }
    end
  end
end
