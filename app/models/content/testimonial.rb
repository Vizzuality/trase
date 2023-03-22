# == Schema Information
#
# Table name: content.testimonials
#
#  id                 :bigint(8)        not null, primary key
#  quote              :text             not null
#  author_name        :text             not null
#  author_title       :text             not null
#  image_file_name    :string
#  image_content_type :string
#  image_file_size    :integer
#  image_updated_at   :datetime
#
module Content
  class Testimonial < Content::Base
    validates :quote, presence: true
    validates :author_name, presence: true
    validates :author_title, presence: true

    has_attached_file :image, styles: {small: "320x320>", large: "640x640>"}
    validates_attachment_content_type :image, content_type: /\Aimage\/.*\z/
  end
end
