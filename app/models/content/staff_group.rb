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
