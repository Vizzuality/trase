module Content
  class StaffMember < Content::Base
    has_attached_file :image, styles: {small: '260x260>'}

    validates :name, presence: true
    validates :position, presence: true, numericality: true
    validates :bio, presence: true
    validates_attachment_content_type :image, content_type: /\Aimage\/.*\z/
  end
end
