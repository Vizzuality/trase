# == Schema Information
#
# Table name: ind_country_properties
#
#  id           :bigint(8)        not null, primary key
#  tooltip_text :text
#  country_id   :bigint(8)
#  ind_id       :bigint(8)
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
# Indexes
#
#  index_ind_country_properties_on_country_id  (country_id)
#  index_ind_country_properties_on_ind_id      (ind_id)
#
# Foreign Keys
#
#  fk_rails_...  (country_id => countries.id)
#  fk_rails_...  (ind_id => inds.id)
#

module Api
  module V3
    class IndCountryProperty < ApplicationRecord
      belongs_to :country
      belongs_to :ind

      after_commit :refresh_dependents

      def refresh_dependents
        Api::V3::Readonly::CountryAttributeProperty.refresh
      end
    end
  end
end
