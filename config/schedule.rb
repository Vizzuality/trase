# Use this file to easily define all of your cron jobs.
#
# It's helpful, but not entirely necessary to understand cron before proceeding.
# http://en.wikipedia.org/wiki/Cron

# Example:
#
# set :output, "/path/to/my/cron_log.log"
#
# every 2.hours do
#   command "/usr/bin/some_great_command"
#   runner "MyModel.some_method"
#   rake "some:great:rake:task"
# end
#
# every 4.days do
#   runner "AnotherModel.prune_old_records"
# end

# Learn more: http://github.com/javan/whenever

# We want the script to run monthly on the 1st Friday
# that's not possible to specify via cron
# so run it every Friday, but within the script return unless 1st Friday
every :friday, at: '8pm', roles: [:db] do
  runner 'Api::V3::CountriesWbIndicators::ImporterService.call'
  runner 'Api::V3::CountriesComTradeIndicators::ImporterService.new.call'
end

every :day, at: '11:30pm', roles: [:db] do
  rake 'unblock_jobs'
end
