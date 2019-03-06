# == Schema Information
#
# Table name: qual_context_properties
#
#  id           :bigint(8)        not null, primary key
#  tooltip_text :text
#  context_id   :bigint(8)
#  qual_id      :bigint(8)
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
# Indexes
#
#  index_qual_context_properties_on_context_id  (context_id)
#  index_qual_context_properties_on_qual_id     (qual_id)
#
# Foreign Keys
#
#  fk_rails_...  (context_id => contexts.id)
#  fk_rails_...  (qual_id => quals.id)
#

module Api
  module V3
    class QualContextProperty < ApplicationRecord
      belongs_to :context
      belongs_to :qual

      after_commit :refresh_dependents

      def refresh_dependents
        Api::V3::Readonly::ContextAttributeProperty.refresh
      end
    end
  end
end
