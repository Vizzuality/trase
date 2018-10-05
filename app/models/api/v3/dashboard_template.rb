# == Schema Information
#
# Table name: dashboard_templates
#
#  id                 :integer          not null, primary key
#  title              :text             not null
#  description        :text             not null
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  image_file_name    :string
#  image_content_type :string
#  image_file_size    :integer
#  image_updated_at   :datetime
#

module Api
  module V3
    class DashboardTemplate < YellowTable
      has_many :dashboard_template_commodities
      has_many :commodities, through: :dashboard_template_commodities

      has_many :dashboard_template_companies
      has_many :companies, through: :dashboard_template_companies, source: :node

      has_many :dashboard_template_countries
      has_many :countries, through: :dashboard_template_countries

      has_many :dashboard_template_destinations
      has_many :destinations, through: :dashboard_template_destinations, source: :node

      has_many :dashboard_template_sources
      has_many :sources, through: :dashboard_template_sources, source: :node

      has_attached_file :image, styles: {small: '320x320>', large: '640x640>'}
      validates_attachment_content_type :image, content_type: /\Aimage\/.*\z/
    end
  end
end
