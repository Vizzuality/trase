class RemoveTopExportingCountriesFromImporterCountryProfile < ActiveRecord::Migration[6.1]
  def change
    country_of_destination_node_types = Api::V3::NodeType.select(:id).where(name: NodeTypeName.destination_country_names)
    country_of_destination_context_node_types = Api::V3::ContextNodeType.select(:id).where(node_type_id: country_of_destination_node_types)
    country_of_destination_profiles = Api::V3::Profile.where(name: Api::V3::Profile::COUNTRY, context_node_type_id: country_of_destination_context_node_types)
    top_exporting_countries_charts = Api::V3::Chart.where(identifier: :country_top_consumer_countries, profile_id: country_of_destination_profiles)
    top_exporting_countries_charts.each(&:destroy)
  end
end
