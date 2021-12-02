require 'active_support/concern'

module Api
  module V3
    module UrlFixer
      extend ActiveSupport::Concern

      def format_url(attr_sym)
        attr_before = send(attr_sym)
        if attr_before.blank?
          send(:"#{attr_sym}=", nil)
          return
        end

        attr_after = attr_before.gsub(/<[^>]*>/, '').sub(/^(https?:\/\/)+/, '\\1')
        attr_after = "https://#{attr_after}" if attr_after !~ /^http/

        send(:"#{attr_sym}=", attr_after) if attr_after != attr_before
      end
    end
  end
end
