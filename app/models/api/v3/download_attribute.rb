module Api
  module V3
    class DownloadAttribute < YellowTable
      belongs_to :context

      def self.blue_foreign_keys
        [
          {name: :context_id, table_class: Api::V3::Context}
        ]
      end
    end
  end
end
