# == Schema Information
#
# Table name: quals
#
#  id         :integer          not null, primary key
#  name       :text             not null
#  created_at :datetime         not null
#
# Indexes
#
#  quals_name_key  (name) UNIQUE
#

module Api
  module V3
    class Qual < BlueTable
      has_one :qual_property
      has_many :node_quals

      delegate :display_name, to: :qual_property, allow_nil: true

      def self.select_options
        order(:name).map { |qual| [qual.name, qual.id] }
      end

      def self.import_key
        [
          {name: :name, sql_type: 'TEXT'}
        ]
      end
    end
  end
end
