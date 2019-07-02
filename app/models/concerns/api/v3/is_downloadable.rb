module Api
  module V3
    module IsDownloadable
      extend ActiveSupport::Concern

      def supports_download_name?
        return false unless original_attribute

        original_attribute.respond_to?(:download_original_attribute)
      end

      def is_downloadable
        return nil unless supports_download_name?

        download_attribute.present?
      end

      def download_name
        return nil unless supports_download_name?

        download_attribute&.display_name
      end

      def download_attribute
        original_attribute.
          download_original_attribute(context)&.
          download_attribute
      end
    end
  end
end
