# == Schema Information
#
# Table name: qual_context_properties
#
#  id                                                                                                                                                                                      :bigint(8)        not null, primary key
#  tooltip_text(Context-specific tooltips are the most specific tooltips that can be defined; in absence of a context-specific tooltip, a country-specific tooltip will be used (if any).) :text             not null
#  context_id(Reference to context)                                                                                                                                                        :bigint(8)        not null
#  qual_id(Reference to qual)                                                                                                                                                              :bigint(8)        not null
#
# Indexes
#
#  qual_context_properties_context_id_idx  (context_id)
#  qual_context_properties_qual_id_idx     (qual_id)
#
# Foreign Keys
#
#  fk_rails_...  (context_id => contexts.id) ON DELETE => cascade ON UPDATE => cascade
#  fk_rails_...  (qual_id => quals.id) ON DELETE => cascade ON UPDATE => cascade
#
module Api
  module V3
    class QualContextProperty < YellowTable
      belongs_to :context
      belongs_to :qual

      validates :context, presence: true
      validates :qual, presence: true, uniqueness: {scope: :context}
      validates :tooltip_text, presence: true

      after_commit :refresh_dependents

      def self.blue_foreign_keys
        [
          {name: :qual_id, table_class: Api::V3::Qual},
          {name: :context_id, table_class: Api::V3::Context}
        ]
      end

      def refresh_dependents
        refresh_actor_basic_attributes
      end

      def refresh_actor_basic_attributes
        # Update previous NodeWithFlows
        # The behaviour is the same if the identifier or the chart_id changes
        if context_id_before_last_save && qual_id_before_last_save
          update_node_with_flows_actor_basic_attributes(
            context_id_before_last_save, qual_id_before_last_save
          )
        end

        # Update new NodeWithFlows
        update_node_with_flows_actor_basic_attributes(context_id, qual_id)
      end

      def update_node_with_flows_actor_basic_attributes(context_id, qual_id)
        nodes_with_flows = Api::V3::Readonly::NodeWithFlows.
          select(:id, :context_id).
          without_unknowns.
          without_domestic.
          where(
            context_id: context_id,
            id: Api::V3::NodeQual.select(:node_id).where(qual_id: qual_id).distinct
          )
        nodes_with_flows.each do |node|
          NodeWithFlowsRefreshActorBasicAttributesWorker.perform_async(
            node.id, node.context_id
          )
        end
      end
    end
  end
end
