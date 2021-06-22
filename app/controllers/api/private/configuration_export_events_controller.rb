module Api
  module Private
    class ConfigurationExportEventsController < BaseController
      def show
        event = Api::Private::ConfigurationExportEvent.find(params[:id])
        render json: event, root: :data
      end

      def create
        event = Api::Private::ConfigurationExportEvent.create(started_by: current_user.email)
        ConfigurationExportWorker.perform_async(event.id)
        render json: event, root: :data
      end
    end
  end
end
