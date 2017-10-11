# == Schema Information
#
# Table name: download_versions
#
#  id         :integer          not null, primary key
#  symbol     :string           not null
#  current    :boolean          default("false")
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  context_id :integer
#

class DownloadVersion < ApplicationRecord
  def self.current_version_symbol(context)
    current_version = where(current: true, context_id: context.id).order('created_at DESC').first
    current_version && current_version.symbol
  end
end
