# == Schema Information
#
# Table name: country_properties
#
#  id                                                                                                                :integer          not null, primary key
#  country_id                                                                                                        :integer          not null
#  latitude(Country latitide)                                                                                        :float            not null
#  longitude(Country longitude)                                                                                      :float            not null
#  zoom(Zoom level (0-18))                                                                                           :integer          not null
#  annotation_position_x_pos(X position (in coordinates) where the country's label is displayed on the explore page) :float
#  annotation_position_y_pos(Y position (in coordinates) where the country's label is displayed on the explore page) :float
#
# Indexes
#
#  country_properties_country_id_key  (country_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (country_id => countries.id) ON DELETE => cascade ON UPDATE => cascade
#
module Api
  module V3
    class CountryProperty < YellowTable
      belongs_to :country

      validates :country, presence: true, uniqueness: true
      validates :latitude, presence: true
      validates :longitude, presence: true
      validates :zoom, presence: true, inclusion: {in: 0..18}

      def self.blue_foreign_keys
        [
          {name: :country_id, table_class: Api::V3::Country}
        ]
      end
    end
  end
end
