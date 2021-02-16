module Api
  module Private
    class ConfigurationExportEventsController < BaseController
      def show
        event = Api::Private::ConfigurationExportEvent.find(params[:id])
        render json: event, root: :data
      end

      def create
        started_or_queued_event = Api::Private::ConfigurationExportEvent.started_or_queued.order(created_at: :desc).first
        if started_or_queued_event.present?
          render json: started_or_queued_event, root: :data and return
        end

        event = Api::Private::ConfigurationExportEvent.create(started_by: current_user.email)
        @job_id = ConfigurationExportWorker.perform_async(event.id)
        event.update_attribute(:jid, @job_id)
        render json: event, root: :data
      end
    end
  end
end
