require "#{Rails.root}/lib/modules/cache/warmer.rb"
require "#{Rails.root}/lib/modules/cache/cleaner.rb"

namespace :cache do
  namespace :cleaner do
    task clear_all: :environment do
      Cache::Cleaner.clear_all
    end
  end
  namespace :warmer do
    task generate_urls: :environment do
      Cache::Warmer::UrlsFile.generate
    end

    task run: :environment do
      Cache::Warmer.run
    end
  end
end
