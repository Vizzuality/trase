ActiveAdmin.register_page 'Database Import' do
  menu parent: 'Database', priority: 2

  content do
    database_versions = S3::ObjectList.instance.call(
      exclude: ['MAIN']
    )
    render partial: 'admin/database_import/form', locals: {
      database_versions: database_versions, jid: params[:jid]
    }
  end

  page_action :call, method: :post do
    @job_id = DatabaseImportWorker.perform_async(
      params[:database_version]
    )
    notice = "Database import #{@job_id} scheduled. Please check status using \
the background job monitor."
    redirect_to admin_database_import_path, notice: notice
  end
end
