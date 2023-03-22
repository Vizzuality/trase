ActiveAdmin.register_page "Database Update" do
  menu parent: "Database", priority: 3, if: proc { controller.data_update_supported? }

  controller do
    before_action :ensure_data_update_supported
  end

  content do
    current_update = Api::V3::DatabaseUpdate.started.first
    database_updates = Api::V3::DatabaseUpdate.order(created_at: :desc).limit(25)
    main_schema_versions = S3::ObjectList.instance.call(
      include: [Api::V3::DatabaseUpdate::S3_PREFIX]
    )
    unless current_update
      render partial: "admin/database_update/mirror_form", locals: {
        current_update: current_update,
        main_schema_versions: main_schema_versions
      }
    end
    render partial: "admin/database_update/list", locals: {
      current_update: current_update,
      database_updates: database_updates
    }
  end

  page_action :start_mirror, method: :post do
    main_schema_version = params[:main_schema_version]
    database_update = Api::V3::DatabaseUpdate.new(
      status: Api::V3::DatabaseUpdate::STARTED,
      filename: main_schema_version
    )
    if database_update.save
      MirrorDatabaseUpdateWorker.perform_async(database_update.id, main_schema_version)
      redirect_to admin_database_update_path, notice: "Database update scheduled. Please refresh for updates."
    else
      redirect_to admin_database_update_path, notice: "Database update already in progress."
    end
  end
end
