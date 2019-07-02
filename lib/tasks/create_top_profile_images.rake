require 'open-uri'

namespace :db do
  desc 'Assign images from public folder to TopProfileImages records'
  task create_top_profile_images: :environment do
    Dir.each_child('public/images/top_profiles') do |commodity|
      Dir.each_child("public/images/top_profiles/#{commodity}") do |file|
        image = open("public/images/top_profiles/#{commodity}/#{file}")
        next unless Api::V3::TopProfileImage.find_by(image_file_name: file).nil?
        commodity_object = Api::V3::Commodity.find_by(name: commodity.tr('-', ' ').upcase)
        top_profile_image = Api::V3::TopProfileImage.new(commodity: commodity_object, profile_type: 'actor')
        top_profile_image.image = image
        top_profile_image.save
      end
    end
  end
end
