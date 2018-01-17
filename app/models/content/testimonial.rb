module Content
  class Testimonial < Content::Base
    validates :quote, presence: true
    validates :author_name, presence: true
    validates :author_title, presence: true

    has_attached_file :image, styles: {small: '320x320>', large: '640x640>'}
    validates_attachment_content_type :image, content_type: /\Aimage\/.*\z/
  end
end
