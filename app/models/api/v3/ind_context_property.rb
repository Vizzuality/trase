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
    class IndContextProperty < YellowTable
      belongs_to :context
      belongs_to :ind

      validates :context, presence: true
      validates :ind, presence: true, uniqueness: {scope: :context}

      after_commit :refresh_dependents

      def self.blue_foreign_keys
        [
          {name: :ind_id, table_class: Api::V3::Ind},
          {name: :context_id, table_class: Api::V3::Context}
        ]
      end

      def refresh_dependents
        Api::V3::Readonly::ContextAttributeProperty.refresh
      end
    end
  end
end
