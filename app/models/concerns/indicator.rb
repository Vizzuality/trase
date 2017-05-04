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
  end
end
