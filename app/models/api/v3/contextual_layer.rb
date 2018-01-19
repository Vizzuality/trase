module Api
  module V3
    class ContextualLayer < BaseModel
      include Api::V3::Import::YellowTableHelpers

      belongs_to :context

      has_many :carto_layers

      scope :default, -> { where(is_default: true) }

      def self.blue_foreign_keys
        [
          {name: :context_id, table_class: Api::V3::Context}
        ]
      end
    end
  end
end
