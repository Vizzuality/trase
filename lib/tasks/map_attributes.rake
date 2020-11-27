namespace :map_attributes do
  desc 'Refresh map attributes csv export in a background job'
  task refresh_later: :environment do
    MapAttributesExportWorker.perform_async
  end
end