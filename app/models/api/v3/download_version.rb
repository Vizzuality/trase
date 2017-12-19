module Api
  module V3
    class DownloadVersion < BaseModel
      def self.current_version_symbol(context)
        current_version = where(is_current: true, context_id: context.id).
          order('created_at DESC').
          first
        current_version&.symbol
      end
    end
  end
end
