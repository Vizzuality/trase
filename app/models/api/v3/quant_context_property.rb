# == Schema Information
#
# Table name: quant_context_properties
#
#  id           :bigint(8)        not null, primary key
#  tooltip_text :text
#  context_id   :bigint(8)
#  quant_id     :bigint(8)
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
# Indexes
#
#  index_quant_context_properties_on_context_id  (context_id)
#  index_quant_context_properties_on_quant_id    (quant_id)
#
# Foreign Keys
#
#  fk_rails_...  (context_id => contexts.id)
#  fk_rails_...  (quant_id => quants.id)
#

module Api
  module V3
    class QuantContextProperty < ApplicationRecord
      belongs_to :context
      belongs_to :quant
    end
  end
end
