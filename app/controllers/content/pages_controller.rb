module Content
  class PagesController < ApplicationController
    before_action :set_caching_headers

    def show
      @page = Content::Page.find_by_name(params[:name])
      raise ActiveRecord::RecordNotFound unless @page
      render plain: @page.content
    end
  end
end
