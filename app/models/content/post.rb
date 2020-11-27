# == Schema Information
#
# Table name: content.posts
#
#  id                 :integer          not null, primary key
#  title              :text             not null
#  date               :datetime         not null
#  post_url           :text             not null
#  state              :integer          default(0), not null
#  highlighted        :boolean          default(FALSE), not null
#  category           :text             not null
#  image_file_name    :text
#  image_content_type :text
#  image_file_size    :integer
#  image_updated_at   :datetime
#
module Content
  class Post < Content::Base
    CATEGORIES = [
      'NEWS', 'BLOG', 'INSIGHT', 'INFO BRIEF', 'ISSUE BRIEF', 'LONGER READ'
    ].freeze
    validates :title, presence: true
    validates :date, presence: true
    validates :post_url, presence: true
    validates :state, presence: true, inclusion: [0, 1]
    validates :highlighted, inclusion: {in: [true, false]}
    validates :category, presence: true, inclusion: CATEGORIES

    has_attached_file :image, styles: {small: '320x320>', large: '640x640>'}
    validates_attachment_content_type :image, content_type: /\Aimage\/.*\z/

    after_initialize :set_default_date
    before_save :reset_highlighted_flag,
                if: -> { highlighted && highlighted_changed? }

    def complete_post_url
      return post_url if post_url.start_with?('http://', 'https://')
      'http://' + post_url
    end

    def set_default_date
      self.date ||= DateTime.now
    end

    def reset_highlighted_flag
      Content::Post.update_all(highlighted: false)
    end
  end
end
