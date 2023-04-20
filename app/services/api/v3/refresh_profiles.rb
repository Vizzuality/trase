# Service for refreshing precomputed basic attributes
module Api
  module V3
    class RefreshProfiles
      def initialize(commodity_id = nil, country_id = nil)
        @nodes_with_flows = Api::V3::Readonly::NodeWithFlows
          .without_unknowns
          .without_domestic
          .where(profile: Api::V3::Profile::ACTOR)
        if commodity_id
          @nodes_with_flows = @nodes_with_flows.where(commodity_id: commodity_id)
        end
        if country_id
          @nodes_with_flows = @nodes_with_flows.where(country_id: country_id)
        end
      end

      def call
        clear
        @nodes_with_flows.each do |node|
          node.refresh_actor_basic_attributes
        end
      end

      def call_later
        clear
        @nodes_with_flows.select(:id, :context_id).distinct.each.with_index do |node, idx|
          NodeWithFlowsRefreshActorBasicAttributesWorker.perform_in(
            idx * 0.5.seconds, node.id, node.context_id
          )
        end
      end

      def clear
        @nodes_with_flows.update_all(actor_basic_attributes: nil)
      end
    end
  end
end
