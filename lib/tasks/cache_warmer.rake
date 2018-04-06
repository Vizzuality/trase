require "#{Rails.root}/lib/modules/cache_warmer.rb"

namespace :cache do
  namespace :warmer do
    task generate_urls: :environment do
      CacheWarmer::UrlsFile.generate
    end

    task run: :environment do
      CacheWarmer.run
    end
  end
end
