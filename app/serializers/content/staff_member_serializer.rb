module Content
  class StaffMemberSerializer < ActiveModel::Serializer
    attributes :name, :position, :bio

    belongs_to :staff_group

    attribute :small_image_url do
      object.image.url(:small)
    end
  end
end
