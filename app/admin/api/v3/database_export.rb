ActiveAdmin.register_page 'Database Export' do
  menu parent: 'Database', priority: 1

  content do
    database_versions = Api::V3::S3ObjectList.instance.call
    render partial: 'admin/database_export/form', locals: {
      database_versions: database_versions
    }
  end

  page_action :call, method: :post do
    @job_id = DatabaseExportWorker.perform_async
    notice = "Database export #{@job_id} scheduled. Please check status using \
the background job monitor."
    redirect_to admin_database_export_path, notice: notice
  end
end
