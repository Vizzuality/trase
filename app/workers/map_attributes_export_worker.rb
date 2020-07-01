class MapAttributesExportWorker
  include Sidekiq::Worker
  sidekiq_options queue: :database,
                  retry: 3,
                  backtrace: true

  def perform
    Api::V3::MapAttributesExport.new.call
  end
end
