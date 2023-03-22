namespace :downloads do
  desc "Clear pre-computed bulk downloads"
  task clear: :environment do
    Api::V3::Download::PrecomputedDownload.clear
  end

  desc "Refresh pre-computed bulk downloads"
  task refresh: :environment do
    Api::V3::Download::PrecomputedDownload.refresh
  end

  desc "Refresh pre-computed bulk downloads in a background job"
  task refresh_later: :environment do
    Api::V3::Download::PrecomputedDownload.refresh_later
  end
end
