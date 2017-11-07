FactoryGirl.define do
  factory :post, class: 'Content::Post' do
    image ''
    image_file_name 'image.png'
    image_content_type 'image/png'
    image_file_size 1234
    state 1
  end
end
