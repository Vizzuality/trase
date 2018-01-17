module Api
  module V3
    class DownloadAttribute < BaseModel
      belongs_to :context

      def self.unstable_foreign_keys
        [
          {name: :context_id, table_class: Api::V3::Context}
        ]
      end
    end
  end
end
