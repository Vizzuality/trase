module CacheUtils
  extend ActiveSupport::Concern

  # Uses PURGE to remove objects from cache by url
  # @param url [String]
  def clear_cache_for_url(url)
    with_uri(url) do |uri|
      Rails.logger.debug "Purging: #{uri}"
      Net::HTTP::Purge.new uri.request_uri
    end
  end

  # Uses BAN to remove objects from cache by regexp
  # @param regexp [String]
  def clear_cache_for_regexp(regexp)
    clear_cache_for_regexp_with_uri(regexp, admin_root_url)
  end

  private

  def with_uri(url)
    return unless Rails.env.staging? || Rails.env.production?
    uri = URI(url)
    Net::HTTP.start(uri.host, uri.port, use_ssl: true) do |http|
      request = yield(uri)
      response = http.request request
      Rails.logger.debug "#{response.code}: #{response.message}"
      unless (200...400).cover?(response.code.to_i)
        Rails.logger.error 'A problem occurred. Operation was not performed.'
      end
    end
  rescue => e
    Appsignal.send_error(e)
  end

  def clear_cache_for_regexp_with_uri(regexp, url)
    with_uri(url) do |uri|
      Rails.logger.debug "Banning: #{regexp}"
      request = Net::HTTP::Ban.new uri.request_uri
      request['X-Ban-Url'] = regexp
      request
    end
  end
end
