class TestimonialSerializer < ActiveModel::Serializer
  attributes :id, :quote, :author_name, :author_title, :image_url

  def image_url
    return nil unless object.image.exists?
    ApplicationController.helpers.asset_url(object.image.url(:small))
  end
end
