module Api
  module Public
    class BaseController < ApiController
      around_action :track_event#, if: -> { Rails.env.production? }

      def track_event
        start = Process.clock_gettime(Process::CLOCK_MONOTONIC)
        yield
        finish = Process.clock_gettime(Process::CLOCK_MONOTONIC)
        diff = finish - start
        ApiTracker.new.call(request.path, tracking_params, diff)
      end

      def tracking_params
        {
          commodities: [params[:commodity]],
          countries: [params[:country]]
        }
      end
    end
  end
end
