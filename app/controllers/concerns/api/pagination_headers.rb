module Api
  module PaginationHeaders
    extend ActiveSupport::Concern

    included do
      before_action :set_pagination_headers
    end

    private

    # tried to include pagination headers using a gem
    # but none of them (pager_api, api-pagination) would work
    # when using with_no_count to avoid long count calculations
    def set_pagination_headers
      headers['Access-Control-Expose-Headers'] = 'Link, Page, Per-Page'
      headers['Page'] = current_page
      headers['Per-Page'] = current_per_page
    end

    # rubocop:disable Naming/AccessorMethodName
    def set_link_headers(scope)
      request_params = request.query_parameters
      unless request_params.empty?
        url_without_params = request.original_url.slice(
          0..(request.original_url.index('?') - 1)
        )
      end
      url_without_params ||= request.original_url

      page = {}
      page[:next] = scope.next_page if scope.next_page
      page[:prev] = scope.prev_page if scope.prev_page

      pagination_links = []
      page.each do |k, v|
        new_request_hash = request_params.merge(page: v)
        pagination_links << "<#{url_without_params}?#{new_request_hash.to_param}>; rel=\"#{k}\""
      end
      headers['Link'] = pagination_links.join(', ')
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
