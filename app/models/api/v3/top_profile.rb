# == Schema Information
#
# Table name: top_profiles
#
#  id                   :bigint(8)        not null, primary key
#  context_id           :bigint(8)        not null
#  node_id              :bigint(8)        not null
#  summary              :text
#  year                 :integer
#  profile_type         :string
#  top_profile_image_id :bigint(8)
#
# Indexes
#
#  index_top_profiles_on_context_id            (context_id)
#  index_top_profiles_on_node_id               (node_id)
#  index_top_profiles_on_top_profile_image_id  (top_profile_image_id)
#
# Foreign Keys
#
#  fk_rails_...  (context_id => contexts.id) ON DELETE => cascade ON UPDATE => cascade
#  fk_rails_...  (node_id => nodes.id) ON DELETE => cascade ON UPDATE => cascade
#  fk_rails_...  (top_profile_image_id => top_profile_images.id) ON DELETE => cascade ON UPDATE => cascade
#
module Api
  module V3
    class TopProfile < YellowTable
      belongs_to :context
      belongs_to :node
      belongs_to :top_profile_image, optional: true

      validates :node, presence: true
      validates :context, presence: true

      before_create :derive_top_profile_details

      def self.yellow_foreign_keys
        [
          {name: :top_profile_image_id, table_class: Api::V3::TopProfileImage}
        ]
      end

      def self.blue_foreign_keys
        [
          {name: :context_id, table_class: Api::V3::Context},
          {name: :node_id, table_class: Api::V3::Node}
        ]
      end

      def derive_top_profile_details
        Api::V3::TopProfiles::DeriveTopProfileDetails.call(self)
      end
    end
  end
end
