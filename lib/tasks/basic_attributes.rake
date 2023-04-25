namespace :basic_attributes do
  desc "Refresh profile basic attributes in a background job"
  task refresh_later: :environment do
    Api::V3::RefreshProfiles.new.call_later
  end
end
