module Api
  module V3
    class DownloadVersion < BaseModel
      include Api::V3::Import::BlueTableHelpers

      def self.current_version_symbol(context)
        current_version = where(is_current: true, context_id: context.id).
          order('created_at DESC').
          first
        current_version&.symbol
      end

      def self.import_key
        [
          {name: :context_id, sql_type: 'INT'},
          {name: :symbol, sql_type: 'TEXT'}
        ]
      end

      def self.blue_foreign_keys
        [
          {name: :context_id, table_class: Api::V3::Context}
        ]
      end
    end
  end
end
