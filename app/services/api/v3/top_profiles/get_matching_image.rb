# If no top profile image is assigned to top profile
# this module will return matching image or nil if there are no matching images
module Api
  module V3
    module TopProfiles
      class GetMatchingImage
        attr_reader :top_profile
        attr_reader :size

        class << self
          def call(top_profile, size)
            new(top_profile, size).call
          end
        end

        def initialize(top_profile, size)
          @top_profile = top_profile
          @size = size
        end

        def call
          matching_images = Api::V3::TopProfileImage.
            includes(:top_profiles).
            where(
              commodity_id: top_profile.context.commodity.id,
              profile_type: top_profile.profile_type
            )
          return nil if matching_images.empty?
          orphan_images = matching_images.
            where(top_profiles: {top_profile_image: nil})
          duplicates_inevitable = orphan_images.empty?
          return matching_images.sample.image.url(size) if duplicates_inevitable

          orphan_images.sample.image.url(size)
        end
      end
    end
  end
end
