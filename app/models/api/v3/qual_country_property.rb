# == Schema Information
#
# Table name: qual_country_properties
#
#  id           :bigint(8)        not null, primary key
#  tooltip_text :text
#  country_id   :bigint(8)
#  qual_id      :bigint(8)
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
# Indexes
#
#  index_qual_country_properties_on_country_id  (country_id)
#  index_qual_country_properties_on_qual_id     (qual_id)
#
# Foreign Keys
#
#  fk_rails_...  (country_id => countries.id)
#  fk_rails_...  (qual_id => quals.id)
#

module Api
  module V3
    class QualCountryProperty < ApplicationRecord
      belongs_to :country
      belongs_to :qual
    end
  end
end
