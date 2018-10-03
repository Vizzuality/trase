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
      has_attached_file :image, styles: {small: '320x320>', large: '640x640>'}
      validates_attachment_content_type :image, content_type: /\Aimage\/.*\z/
    end
  end
end
