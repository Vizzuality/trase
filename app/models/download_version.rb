class DownloadVersion < ApplicationRecord
  def self.current_version_symbol
    current_version = where(current: true).order('created_at DESC').first
    current_version && current_version.symbol || 'UNKNOWN_VERSION'
  end
end
