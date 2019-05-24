# == Schema Information
#
# Table name: ind_context_properties
#
#  id                                                                                                                                                                                      :bigint(8)        not null, primary key
#  tooltip_text(Context-specific tooltips are the most specific tooltips that can be defined; in absence of a context-specific tooltip, a country-specific tooltip will be used (if any).) :text             not null
#  context_id(Reference to context)                                                                                                                                                        :bigint(8)        not null
#  ind_id(Reference to ind)                                                                                                                                                                :bigint(8)        not null
#
# Indexes
#
#  index_ind_context_properties_on_context_id  (context_id)
#  index_ind_context_properties_on_ind_id      (ind_id)
#
# Foreign Keys
#
#  fk_rails_...  (context_id => contexts.id) ON DELETE => cascade ON UPDATE => cascade
#  fk_rails_...  (ind_id => inds.id) ON DELETE => cascade ON UPDATE => cascade
#

module Api
  module V3
    class IndContextProperty < YellowTable
      belongs_to :context
      belongs_to :ind

      validates :context, presence: true
      validates :ind, presence: true, uniqueness: {scope: :context}
      validates :tooltip_text, presence: true

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
