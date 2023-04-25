module Api
  module PaginationHeaders
    extend ActiveSupport::Concern

    included do
      include Kaminari::Helpers::UrlHelper
      before_action :set_pagination_headers
    end

    private

    # tried to include pagination headers using a gem
    # but none of them (pager_api, api-pagination) would work
    # when using with_no_count to avoid long count calculations
    def set_pagination_headers
      headers["Access-Control-Expose-Headers"] = "Link, Page, Per-Page"
      headers["Page"] = current_page
      headers["Per-Page"] = current_per_page
    end

    # rubocop:disable Naming/AccessorMethodName
    def set_link_headers(scope)
      pagination_links = []
      if scope.next_page
        pagination_links << "<#{next_page_url(scope)}>; rel=\"next\""
      end
      if scope.prev_page
        pagination_links << "<#{prev_page_url(scope)}>; rel=\"prev\""
      end

      headers["Link"] = pagination_links.join(", ")
    end
    # rubocop:enable Naming/AccessorMethodName

    def current_page
      page = params[:page]&.to_i
      return 1 if page.nil? || page.negative?

      page
    end

    def default_per_page
      25
    end

    def current_per_page
      per_page = params[:per_page]&.to_i
      return default_per_page if per_page.nil? || per_page.negative?

      per_page
    end
  end
end
