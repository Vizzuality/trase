# == Schema Information
#
# Table name: qual_commodity_properties
#
#  id                                                                                                                                                                                                                          :bigint(8)        not null, primary key
#  tooltip_text(Commodity-specific tooltips are the third-most specific tooltips that can be defined after context and country-specific tooltips; in absence of a commodity-specific tooltip, a generic tooltip will be used.) :text             not null
#  commodity_id(Reference to commodity)                                                                                                                                                                                        :bigint(8)        not null
#  qual_id(Reference to qual)                                                                                                                                                                                                  :bigint(8)        not null
#
# Indexes
#
#  qual_commodity_properties_commodity_id_idx  (commodity_id)
#  qual_commodity_properties_qual_id_idx       (qual_id)
#
# Foreign Keys
#
#  fk_rails_...  (commodity_id => commodities.id) ON DELETE => cascade ON UPDATE => cascade
#  fk_rails_...  (qual_id => quals.id) ON DELETE => cascade ON UPDATE => cascade
#

module Api
  module V3
    class QualCommodityProperty < YellowTable
      belongs_to :commodity
      belongs_to :qual

      validates :commodity, presence: true
      validates :qual, presence: true, uniqueness: {scope: :commodity}
      validates :tooltip_text, presence: true

      after_commit :refresh_dependents
      after_commit :refresh_actor_basic_attributes

      def self.blue_foreign_keys
        [
          {name: :qual_id, table_class: Api::V3::Qual},
          {name: :commodity_id, table_class: Api::V3::Commodity}
        ]
      end

      def refresh_dependents
        Api::V3::Readonly::CommodityAttributeProperty.refresh
      end

      def refresh_actor_basic_attributes
        # Update previous NodeWithFlows
        # The behaviour is the same if the identifier or the chart_id changes
        if commodity_id_before_last_save && qual_id_before_last_save
          update_node_with_flows_actor_basic_attributes(
            commodity_id_before_last_save, qual_id_before_last_save
          )
        end

        # Update new NodeWithFlows
        update_node_with_flows_actor_basic_attributes(commodity_id, qual_id)
      end

      def update_node_with_flows_actor_basic_attributes(commodity_id, qual_id)
        contexts = Api::V3::Context.where(commodity_id: commodity_id)
        node_quals = Api::V3::NodeQual.where(qual_id: qual_id)
        nodes = node_quals.map(&:node)
        node_with_flows = Api::V3::Readonly::NodeWithFlows.
          without_unknowns.
          without_domestic.
          where(context_id: contexts.map(&:id), id: nodes.map(&:id))
        NodeWithFlowsRefreshActorBasicAttributesWorker.new.perform(
          node_with_flows.map(&:id)
        )
      end
    end
  end
end
