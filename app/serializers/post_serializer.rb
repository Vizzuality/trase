# == Schema Information
#
# Table name: posts
#
#  id                 :integer          not null, primary key
#  title              :string
#  date               :datetime
#  image              :string
#  post_url           :string
#  state              :integer
#  description        :text
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  image_file_name    :string
#  image_content_type :string
#  image_file_size    :integer
#  image_updated_at   :datetime
#  highlighted        :boolean          default(FALSE)
#  title_color        :string
#

class PostSerializer < ActiveModel::Serializer
  attributes :title, :title_color, :description, :date, :highlighted, :complete_post_url,
             :category

  attribute :image_url do
    object.image.url(:small)
  end
end
