# == Schema Information
#
# Table name: content.staff_members
#
#  id                 :bigint(8)        not null, primary key
#  staff_group_id     :bigint(8)        not null
#  name               :text             not null
#  position           :integer          not null
#  bio                :text             not null
#  image_file_name    :text
#  image_content_type :text
#  image_file_size    :integer
#  image_updated_at   :datetime
#
# Foreign Keys
#
#  fk_rails_...  (staff_group_id => content.staff_groups.id) ON DELETE => cascade ON UPDATE => cascade
#
module Content
  class StaffMember < Content::Base
    belongs_to :staff_group
    has_attached_file :image, styles: {small: '260x260>'}

    validates :staff_group, presence: true
    validates :name, presence: true
    validates :position, presence: true, numericality: true
    validates :bio, presence: true
    validates_attachment_content_type :image, content_type: /\Aimage\/.*\z/
  end
end
