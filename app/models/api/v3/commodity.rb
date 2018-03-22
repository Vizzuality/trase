# == Schema Information
#
# Table name: commodities
#
#  id         :integer          not null, primary key
#  name       :text             not null
#  created_at :datetime         not null
#
# Indexes
#
#  commodities_name_key  (name) UNIQUE
#

module Api
  module V3
    class Commodity < BlueTable
      has_many :contexts

      validates :name, presence: true, uniqueness: true

      def self.import_key
        [
          {name: :name, sql_type: 'TEXT'}
        ]
      end
    end
  end
end
