# == Schema Information
#
# Table name: qual_country_properties
#
#  id                                                                                                                                                                                                                               :bigint(8)        not null, primary key
#  tooltip_text(Country-specific tooltips are the second-most specific tooltips that can be defined after context-specific tooltips; in absence of a country-specific tooltip, a commodity-specific tooltip will be used (if any).) :text             not null
#  country_id(Reference to country)                                                                                                                                                                                                 :bigint(8)        not null
#  qual_id(Reference to qual)                                                                                                                                                                                                       :bigint(8)        not null
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

      def update_node_with_flows_actor_basic_attributes(country_id, _qual_id)
        nodes_ids = Api::V3::Readonly::NodeWithFlows.
          where(country_id: country_id).
          without_unknowns.
          without_domestic.
          pluck(:id)
        NodeWithFlowsRefreshActorBasicAttributesWorker.perform_async(
          nodes_ids.uniq
        )
      end
    end
  end
end
