# == Schema Information
#
# Table name: site_dives
#
#  id          :integer          not null, primary key
#  title       :string
#  description :text
#  page_url    :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

module Content
  class SiteDive < Content::Base
    validates :title, presence: true
    validates :description, presence: true
    validates :page_url, presence: true

    def site_dive_url
      linker = (page_url.include?('?') ? '&' : '?')
      page_url + linker + 'story=' + id.to_s
    end
  end
end
