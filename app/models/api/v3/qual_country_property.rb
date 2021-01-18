# == Schema Information
#
# Table name: qual_country_properties
#
#  id                                                                                                                                                                                                                                 :bigint(8)        not null, primary key
#  tooltip_text(Country-specific tooltips are the second-most specific tooltips that can be defined after context-specific tooltips; in absence of a country-specific tooltip, a commodity-specific tooltip will be used (if any).)   :text             not null
#  country_id(Reference to country)                                                                                                                                                                                                   :bigint(8)        not null
#  qual_id(Reference to qual)                                                                                                                                                                                                         :bigint(8)        not null
#  display_name(Country-specific display names are the second-most specific that can be defined after context-specific display names; in absence of a country-specific display name, a commodity-specific one will be used (if any).) :text             not null
#
# Indexes
#
#  qual_country_properties_country_id_idx  (country_id)
#  qual_country_properties_qual_id_idx     (qual_id)
#
# Foreign Keys
#
#  fk_rails_...  (country_id => countries.id) ON DELETE => cascade ON UPDATE => cascade
#  fk_rails_...  (qual_id => quals.id) ON DELETE => cascade ON UPDATE => cascade
#
module Api
  module V3
    class QualCountryProperty < YellowTable
      belongs_to :country
      belongs_to :qual

      validates :country, presence: true
      validates :qual, presence: true, uniqueness: {scope: :country}
      validates :tooltip_text, presence: true
      validates :display_name, presence: true

      after_commit :refresh_dependents

      def self.blue_foreign_keys
        [
          {name: :qual_id, table_class: Api::V3::Qual},
          {name: :country_id, table_class: Api::V3::Country}
        ]
      end

      def refresh_dependents
        refresh_actor_basic_attributes
      end

      def refresh_actor_basic_attributes
        # Update previous NodeWithFlows
        # The behaviour is the same if the identifier or the chart_id changes
        if country_id_before_last_save && qual_id_before_last_save
          update_node_with_flows_actor_basic_attributes(
            country_id_before_last_save, qual_id_before_last_save
          )
        end

        # Update new NodeWithFlows
        update_node_with_flows_actor_basic_attributes(country_id, qual_id)
      end

      def update_node_with_flows_actor_basic_attributes(country_id, qual_id)
        nodes_with_flows = Api::V3::Readonly::NodeWithFlows.
          select(:id, :context_id).
          without_unknowns.
          without_domestic.
          where(
            country_id: country_id,
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
