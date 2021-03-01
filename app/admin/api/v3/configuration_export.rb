ActiveAdmin.register_page 'Configuration Export' do
  menu parent: 'Database', priority: 3

  content do
    events = Api::Private::ConfigurationExportEvent.order(created_at: :desc).limit(20)
    started_or_queued_event = Api::Private::ConfigurationExportEvent.started_or_queued.order(created_at: :desc).first

    render partial: 'admin/configuration_export/form', locals: {
      started_or_queued_event: started_or_queued_event
    }

    render partial: 'admin/configuration_export/list', locals: {
      events: events
    }
  end

  page_action :start, method: :post do
    started_or_queued_event = Api::Private::ConfigurationExportEvent.started_or_queued.order(created_at: :desc).first
    if started_or_queued_event
      notice = 'Export already started or queued'
    else
      event = Api::Private::ConfigurationExportEvent.create(started_by: current_user.email)
      @job_id = ConfigurationExportWorker.perform_async(event.id)
      event.update_attribute(:jid, @job_id)
      notice = "Configuration export #{@job_id} scheduled. Please check status using \
  the background job monitor."
    end
    redirect_to admin_configuration_export_path, notice: notice
  end

  page_action :download, method: :get do
    event = Api::Private::ConfigurationExportEvent.find(params[:id])
    send_data event.data, filename: "configuration_#{event.updated_at}.json"
  end

  page_action :destroy, method: :delete do
    event = Api::Private::ConfigurationExportEvent.find(params[:id])
    event.destroy
    redirect_to admin_configuration_export_path, notice: notice
  end
end
