module Api
  module V3
    class DownloadAttribute < YellowTable
      include Api::V3::StringyArray

      belongs_to :context

      validates :context, presence: true
      validates :position, presence: true, uniqueness: {scope: :context}
      validates :display_name, presence: true

      stringy_array :years

      def self.blue_foreign_keys
        [
          {name: :context_id, table_class: Api::V3::Context}
        ]
      end
    end
  end
end
