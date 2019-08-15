namespace :db do
  namespace :table_partitions do
    desc 'Create partitions for download_flows'
    task download_flows: :environment do
      Api::V3::TablePartitions::CreatePartitionsForDownloadFlows.new.call
    end
  end
end
