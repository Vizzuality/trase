# == Schema Information
#
# Table name: ind_context_properties
#
#  id           :bigint(8)        not null, primary key
#  tooltip_text :text
#  context_id   :bigint(8)
#  ind_id       :bigint(8)
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
# Indexes
#
#  index_ind_context_properties_on_context_id  (context_id)
#  index_ind_context_properties_on_ind_id      (ind_id)
#
# Foreign Keys
#
#  fk_rails_...  (context_id => contexts.id)
#  fk_rails_...  (ind_id => inds.id)
#

module Api
  module V3
    class IndContextProperty < ApplicationRecord
      belongs_to :context
      belongs_to :ind

      after_commit :refresh_dependents

      def refresh_dependents
        Api::V3::Readonly::ContextAttributeProperty.refresh
      end
    end
  end
end
