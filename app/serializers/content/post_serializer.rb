module Content
  class PostSerializer < ActiveModel::Serializer
    attributes :title, :date, :highlighted, :complete_post_url,
               :category

    attribute :image_url do
      url = object.image.url(:small)
      url = "/content" + url unless Rails.env.development? || Rails.env.test?
      url
    end
  end
end
