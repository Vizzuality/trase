module Api
  module PaginatedCollection
    extend ActiveSupport::Concern

    def initialize_collection_for_index
      @collection = filter_klass.new(filter_params).
        call.
        page(current_page).
        per(current_per_page).
        without_count
      set_link_headers(@collection)
    end

    def initialize_collection_for_search
      @collection = filter_klass.new(filter_params).
        call_with_query_term(params[:q]).
        page(current_page).
        per(current_per_page).
        without_count
      set_link_headers(@collection)
    end
  end
end
