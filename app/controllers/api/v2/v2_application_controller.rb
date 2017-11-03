module Api
  module V2
    class V2ApplicationController < ApplicationController
      before_action :load_context, except: [:get_contexts, :place_data, :actor_data]
      before_action :set_caching_headers
    end
  end
end
