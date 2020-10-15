# == Schema Information
#
# Table name: quant_context_properties
#
#  id                                                                                                                                                                                      :bigint(8)        not null, primary key
#  tooltip_text(Context-specific tooltips are the most specific tooltips that can be defined; in absence of a context-specific tooltip, a country-specific tooltip will be used (if any).) :text             not null
#  context_id(Reference to context)                                                                                                                                                        :bigint(8)        not null
#  quant_id(Reference to quant)                                                                                                                                                            :bigint(8)        not null
#
# Indexes
#
#  quant_context_properties_context_id_idx  (context_id)
#  quant_context_properties_quant_id_idx    (quant_id)
#
# Foreign Keys
#
#  fk_rails_...  (context_id => contexts.id) ON DELETE => cascade ON UPDATE => cascade
#  fk_rails_...  (quant_id => quants.id) ON DELETE => cascade ON UPDATE => cascade
#
module Api
  module V3
    class QuantContextProperty < YellowTable
      belongs_to :context
      belongs_to :quant

      validates :context, presence: true
      validates :quant, presence: true, uniqueness: {scope: :context}
      validates :tooltip_text, presence: true

      def self.blue_foreign_keys
        [
          {name: :quant_id, table_class: Api::V3::Quant},
          {name: :context_id, table_class: Api::V3::Context}
        ]
      end
    end
  end
end
