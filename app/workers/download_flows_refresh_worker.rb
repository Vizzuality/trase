class DownloadFlowsRefreshWorker
  include Sidekiq::Worker
  sidekiq_options retry: 0, backtrace: true, unique: :until_and_while_executing

  def perform(options)
    Api::V3::Readonly::DownloadFlow.refresh(options)
  end
end
