require "#{Rails.root}/lib/cache/cleaner.rb"

namespace :cache do
  namespace :cleaner do
    task clear_all: :environment do
      Cache::Cleaner.clear_all
    end
  end
end
