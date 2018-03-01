module Api
  module V3
    class DatabaseValidationController < ApiController
      skip_before_action :load_context

      def show
        @report = Api::V3::DatabaseValidation::Report.new
        render json: @report.call
      end
    end
  end
end
