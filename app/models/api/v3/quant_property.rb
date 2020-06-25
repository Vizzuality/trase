# == Schema Information
#
# Table name: quant_properties
#
#  id                                                                    :integer          not null, primary key
#  quant_id                                                              :integer          not null
#  display_name(Name of attribute for display)                           :text             not null
#  unit_type(Type of unit, e.g. count. One of restricted set of values.) :text
#  tooltip_text(Generic tooltip text (lowest precedence))                :text
#
# Indexes
#
#  quant_properties_quant_id_idx  (quant_id)
#  quant_properties_quant_id_key  (quant_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (quant_id => quants.id) ON DELETE => cascade ON UPDATE => cascade
#

module Api
  module V3
    class QuantProperty < YellowTable
      UNIT_TYPE = %w(
        currency
        area
        count
        volume
        unitless
      ).freeze

      belongs_to :quant

      validates :quant, presence: true, uniqueness: true
      validates :display_name, presence: true
      validates :unit_type, inclusion: {in: UNIT_TYPE, allow_blank: true}

      after_commit :refresh_dependents

      def self.blue_foreign_keys
        [
          {name: :quant_id, table_class: Api::V3::Quant}
        ]
      end

      def refresh_dependents
        Api::V3::Readonly::Attribute.refresh
      end
    end
  end
end
