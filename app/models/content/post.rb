# == Schema Information
#
# Table name: posts
#
#  id                 :integer          not null, primary key
#  title              :string
#  date               :datetime
#  image              :string
#  post_url           :string
#  state              :integer
#  description        :text
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  image_file_name    :string
#  image_content_type :string
#  image_file_size    :integer
#  image_updated_at   :datetime
#  highlighted        :boolean          default(FALSE)
#  title_color        :string
#

module Content
  class Post < Content::Base
    validates :title, presence: true
    validates :date, presence: true
    validates :post_url, presence: true
    validates :description, presence: true

    has_attached_file :image, styles: {small: '320x320>', large: '640x640>'}
    validates_attachment_content_type :image, content_type: /\Aimage\/.*\z/

    after_initialize :set_default_date

    def complete_post_url
      return self.post_url if self.post_url.start_with?('http://', 'https://')
      'http://'+self.post_url
    end

    def set_default_date
      self.date ||= DateTime.now
    end

  end
end
