module Content
  class StaffMemberSerializer < ActiveModel::Serializer
    attributes :name, :position, :bio

    attribute :small_image_url do
      object.image.url(:small)
    end
  end
end
