class DownloadFlowsRefreshWorker
  include Sidekiq::Worker
  sidekiq_options retry: false

  def perform(options)
    # first check if there any jobs of this type already queued
    # TODO
    Api::V3::Readonly::DownloadFlow.refresh(options)
  end
end
