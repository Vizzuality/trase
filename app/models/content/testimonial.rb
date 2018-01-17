module Content
  class Testimonial < Content::Base
    has_attached_file :image, styles: {small: '320x320>', large: '640x640>'}
    validates_attachment_content_type :image, content_type: /\Aimage\/.*\z/
  end
end
