module Content
  class SiteDivesController < ApplicationController
    before_action :set_caching_headers

    def show
      @site_dive = Content::SiteDive.find(params[:id])
      render json: @site_dive, root: 'data', serializer: SiteDiveSerializer
    end
  end
end
