require 'active_support/concern'
module Api
  module V3
    module AttributePropertiesProfileScopes
      extend ActiveSupport::Concern

      included do
        scope :place_temporal, -> {
          where('is_visible_on_place_profile AND is_temporal_on_place_profile')
        }
        scope :place_non_temporal, -> {
          where('is_visible_on_place_profile AND NOT is_temporal_on_place_profile')
        }
        scope :actor_temporal, -> {
          where('is_visible_on_actor_profile AND is_temporal_on_actor_profile')
        }
        scope :actor_non_temporal, -> {
          where('is_visible_on_actor_profile AND NOT is_temporal_on_actor_profile')
        }
      end
    end
  end
end
