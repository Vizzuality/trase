module Api
  module V3
    class ManageDownloadAttribute
      def initialize(context, original_attribute)
        @context = context
        @original_attribute = original_attribute
      end

      def call(is_downloadable, download_name)
        return nil unless supports_download_name?

        is_downloadable_bool = ActiveModel::Type::Boolean.new.cast(is_downloadable)

        if is_downloadable_bool
          create_or_update_download_attribute(download_name)
        else
          destroy_download_attribute
        end
      end

      private

      def create_or_update_download_attribute(download_name)
        download_attribute = @original_attribute.
          download_original_attribute(@context)&.
          download_attribute
        unless download_attribute
          download_attribute = Api::V3::DownloadAttribute.new(
            context: @context,
            display_name: download_name
          )
          original_attribute_simple_type = @original_attribute.simple_type
          download_attribute.send(
            :"build_download_#{original_attribute_simple_type}",
            original_attribute_simple_type => @original_attribute
          )
        end
        download_attribute.display_name = download_name || @original_attribute.name
        download_attribute.save
      end

      def destroy_download_attribute
        download_attribute = @original_attribute.
          download_original_attribute(@context)&.
          download_attribute
        return unless download_attribute

        download_attribute.destroy
      end

      def supports_download_name?
        @original_attribute.respond_to?(:download_original_attribute)
      end
    end
  end
end
