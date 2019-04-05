namespace :db do
  namespace :partitioning do
    task create: :environment do
      Api::V3::TablePartitions.create
    end

    task drop: :environment do
      Api::V3::TablePartitions.drop
    end
  end
end
