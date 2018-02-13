ActiveAdmin.register_page 'Database Update' do
  menu priority: 4

  content do
    current_update = Api::V3::DatabaseUpdate.where(status: Api::V3::DatabaseUpdate::STARTED).first
    database_updates = Api::V3::DatabaseUpdate.order(created_at: :desc).limit(25)
    render partial: 'admin/database_update/form', locals: {
      current_update: current_update,
      database_updates: database_updates
    }
  end

  page_action :start, method: :post do
    database_update = Api::V3::DatabaseUpdate.new(status: Api::V3::DatabaseUpdate::STARTED)
    if database_update.save
      DatabaseUpdateWorker.perform_async(database_update.id)
      redirect_to admin_database_update_path, notice: 'Database update scheduled. Please refresh for updates.'
    else
      redirect_to admin_database_update_path, notice: 'Database update already in progress.'
    end
  end
end
