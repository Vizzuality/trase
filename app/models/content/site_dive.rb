# == Schema Information
#
# Table name: content.site_dives
#
#  id          :integer          not null, primary key
#  title       :text             not null
#  page_url    :text             not null
#  description :text             not null
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
