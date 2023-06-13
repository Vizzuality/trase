module Content
  class PostsController < ApplicationController
    before_action :set_caching_headers

    def index
      @posts = Content::Post.order(date: "DESC").where(state: 1)
      render json: @posts,
        root: "data",
        each_serializer: Content::PostSerializer
    end
  end
end
