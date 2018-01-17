module Api
  module V3
    class ContextualLayer < BaseModel
      belongs_to :context

      has_many :carto_layers

      scope :default, -> { where(is_default: true) }

      def self.unstable_foreign_keys
        [
          {name: :context_id, table_class: Api::V3::Context}
        ]
      end
    end
  end
end
