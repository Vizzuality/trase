require 'active_support/concern'

module Indicator
  extend ActiveSupport::Concern

  included do
    scope :place_temporal, -> {
      where('place_factsheet AND place_factsheet_temporal')
    }
    scope :place_non_temporal, -> {
      where('place_factsheet AND (NOT place_factsheet_temporal OR place_factsheet_temporal IS NULL)')
    }
    scope :actor_temporal, -> {
      where('actor_factsheet AND actor_factsheet_temporal')
    }
    scope :actor_non_temporal, -> {
      where('actor_factsheet AND (NOT actor_factsheet_temporal OR actor_factsheet_temporal IS NULL)')
    }
  end
end
