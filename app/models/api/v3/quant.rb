# == Schema Information
#
# Table name: quants
#
#  id         :integer          not null, primary key
#  name       :text             not null
#  unit       :text
#  created_at :datetime         not null
#
# Indexes
#
#  quants_name_key  (name) UNIQUE
#

module Api
  module V3
    class Quant < BlueTable
      has_one :quant_property
      has_many :node_quants

      delegate :display_name, to: :quant_property, allow_nil: true

      def self.select_options
        order(:name).map { |quant| [quant.name, quant.id] }
      end

      def self.import_key
        [
          {name: :name, sql_type: 'TEXT'}
        ]
      end
    end
  end
end
