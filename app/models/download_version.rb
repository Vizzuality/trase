# == Schema Information
#
# Table name: download_versions
#
#  id         :integer          not null, primary key
#  symbol     :string           not null
#  current    :boolean          default("false")
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class DownloadVersion < ApplicationRecord
  def self.current_version_symbol
    current_version = where(current: true).order('created_at DESC').first
    current_version && current_version.symbol || 'UNKNOWN_VERSION'
  end
end
