module CacheUtils
  extend ActiveSupport::Concern

  # Uses PURGE to remove objects from cache by url
  # @param url [String]
  def clear_cache_for_url(url)
    Cache::Cleaner.clear_cache_for_url(url)
  end

  # Uses BAN to remove objects from cache by regexp
  # @param regexp [String]
  def clear_cache_for_regexp(regexp)
    Cache::Cleaner.clear_cache_for_regexp(regexp)
  end
end
