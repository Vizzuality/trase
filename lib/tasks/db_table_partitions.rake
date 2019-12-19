namespace :db do
  namespace :table_partitions do
    desc 'Create partitions for download_flows'
    task download_flows: :environment do
      Api::V3::TablePartitions::CreatePartitionsForDownloadFlows.new.call
    end
    desc 'Create partitions for flows'
    task flows: :environment do
      Api::V3::TablePartitions::CreatePartitionsForFlows.new.call
    end

    desc 'Create partitions for flow_quants'
    task flow_quants: :environment do
      Api::V3::TablePartitions::CreatePartitionsForFlowQuants.new.call
    end

    desc 'Create partitions for flow_quals'
    task flow_quals: :environment do
      Api::V3::TablePartitions::CreatePartitionsForFlowQuals.new.call
    end

    desc 'Create partitions for flow_inds'
    task flow_inds: :environment do
      Api::V3::TablePartitions::CreatePartitionsForFlowInds.new.call
    end

    desc 'Create partitions for denormalised_flow_quants'
    task denormalised_flow_quants: :environment do
      Api::V3::TablePartitions::CreatePartitionsForDenormalisedFlowQuants.new.call
    end

    desc 'Create partitions for denormalised_flow_quals'
    task denormalised_flow_quals: :environment do
      Api::V3::TablePartitions::CreatePartitionsForDenormalisedFlowQuals.new.call
    end

    desc 'Create partitions for denormalised_flow_inds'
    task denormalised_flow_inds: :environment do
      Api::V3::TablePartitions::CreatePartitionsForDenormalisedFlowInds.new.call
    end
  end
end
