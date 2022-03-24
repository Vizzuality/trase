# == Schema Information
#
# Table name: quant_properties
#
#  id                                                                                                                                                                         :integer          not null, primary key
#  quant_id                                                                                                                                                                   :integer          not null
#  display_name(Name of attribute for display)                                                                                                                                :text             not null
#  unit_type(Type of unit, e.g. count. One of restricted set of values.)                                                                                                      :text
#  tooltip_text(Generic tooltip text (lowest precedence))                                                                                                                     :text
#  aggregation_method(To be used with ranges, one of SUM, AVG, MAX or MIN)                                                                                                    :text
#  power_of_ten_for_rounding(Values rounded to the nearest 10^n units. So n=0 would be nearest integer, n=1 would be to the nearest ten and n=-1 would be one decimal place.) :integer          default(0), not null
#
# Indexes
#
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

      AGGREGATION_METHOD = %w(
        SUM
        AVG
        MAX
        MIN
      ).freeze

      belongs_to :quant

      validates :quant, presence: true, uniqueness: true
      validates :display_name, presence: true
      validates :unit_type, presence: true, inclusion: {in: UNIT_TYPE}
      validates :aggregation_method, presence: true, inclusion: {in: AGGREGATION_METHOD}
      validates :power_of_ten_for_rounding, presence: true

      def self.blue_foreign_keys
        [
          {name: :quant_id, table_class: Api::V3::Quant}
        ]
      end
    end
  end
end
