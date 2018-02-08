module Content
  class StaffGroupSerializer < ActiveModel::Serializer
    attributes :name, :position

    has_many :staff_members
  end
end
