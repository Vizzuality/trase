Sidekiq.configure_server do |config|
  config.error_handlers << Proc.new do |e, ctx_hash|
    jid = ctx_hash[:job]['jid']
    puts jid
    du = Api::V3::DatabaseUpdate.where(jid: jid).first
    du&.update_attribute(:status, Api::V3::DatabaseUpdate::FAILED)
  end
end
