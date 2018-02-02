module Api
  module V3
    class ContextualLayer < YellowTable
      belongs_to :context
      has_many :carto_layers

      scope :default, -> { where(is_default: true) }

      validates :context, presence: true
      validates :title, presence: true
      validates :identifier, presence: true, uniqueness: {scope: :context}
      validates :position, presence: true, uniqueness: {scope: :context}
      validates :is_default, inclusion: {in: [true, false]}

      def self.select_options
        Api::V3::ContextualLayer.includes(
          context: [:country, :commodity]
        ).all.map do |layer|
          [
            [
              layer.context&.country&.name,
              layer.context&.commodity&.name,
              layer.identifier
            ].join(' / '),
            layer.id
          ]
        end
      end

      def self.blue_foreign_keys
        [
          {name: :context_id, table_class: Api::V3::Context}
        ]
      end
    end
  end
end
