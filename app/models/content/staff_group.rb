# == Schema Information
#
# Table name: content.staff_groups
#
#  id         :integer          not null, primary key
#  name       :text             not null
#  position   :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

module Content
  class StaffGroup < Content::Base
    has_many :staff_members

    validates :name, presence: true
    validates :position, presence: true, numericality: true

    def self.select_options
      order(:position).map { |group| [group.name, group.id] }
    end
  end
end
