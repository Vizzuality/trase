# Given a chart object and profile selection parameters it generates options
# for url_for to retrieve that chart's data.
module Api
  module V3
    module Profiles
      class ChartUrlOptions
        CONTROLLERS_BY_PROFILE_TYPE = {
          Api::V3::Profile::ACTOR => "/api/v3/actors",
          Api::V3::Profile::PLACE => "/api/v3/places",
          Api::V3::Profile::COUNTRY => "/api/v3/country_profiles"
        }.freeze

        # @param chart [Api::V3::Chart]
        # @param chart_params [Hash]
        # @option chart_params [Integer] :id
        # @option chart_params [Integer] :context_id
        # @option chart_params [Integer] :commodity_id
        # @option chart_params [Integer] :year
        # @param activity [Symbol] :importer or :exporter
        def self.url_options(chart, chart_params, activity)
          profile_type = chart.profile.name
          controller_name = CONTROLLERS_BY_PROFILE_TYPE[profile_type]
          action_name = chart.identifier.sub(/#{profile_type}_/, "")
          path_params, query_params =
            path_and_query_params(profile_type, activity)
          {controller: controller_name, action: action_name}.
            merge(chart_params.slice(*path_params)).
            merge(
              {params: chart_params.slice(*query_params)}
            )
        end

        def self.path_and_query_params(profile_type, activity)
          case profile_type
          when Api::V3::Profile::ACTOR, Api::V3::Profile::PLACE
            [[:id, :context_id], [:year]]
          when Api::V3::Profile::COUNTRY
            if activity == :exporter
              [[:id], [:context_id, :year]]
            else
              [[:id], [:commodity_id, :year]]
            end
          end
        end
      end
    end
  end
end

# place urls
# place_basic_attributes
#   /api/v3/contexts/1/places/11106/basic_attributes?year=2017 (year optional)
# place_indicators
#   /api/v3/contexts/1/places/11106/indicators?year=2017 (year optional)
# place_trajectory_deforestation
#   /api/v3/contexts/1/places/11106/trajectory_deforestation?year=2017 (year optional)
# place_top_consumer_actors
#   /api/v3/contexts/1/places/11106/top_consumer_actors?year=2017 (year optional)
# place_top_consumer_countries
#   /api/v3/contexts/1/places/11106/top_consumer_countries?year=2017 (year optional)

# actor urls
# actor_basic_attributes
#   /api/v3/contexts/1/actors/23670/basic_attributes?year=2017 (year optional)
# actor_top_countries
#   /api/v3/contexts/1/actors/23670/top_countries?year=2017 (year optional)
# actor_top_sources
#   /api/v3/contexts/1/actors/23070/top_sources?year=2017 (year optional)
# actor_sustainability
#   /api/v3/contexts/1/actors/23670/sustainability?year=2017 (year optional)
# actor_exporting_companies
#   /api/v3/contexts/1/actors/23670/exporting_companies?year=2017 (year optional)

# country urls
# country_basic_attributes
#   /api/v3/country_profiles/58/basic_attributes?year=2015
# country_commodity_exports (exporter only)
#   /api/v3/country_profiles/58/commodity_exports?year=2015
# country_commodity_imports (importer only)
#   /api/v3/country_profiles/57/commodity_imports?year=2015
# country_trajectory_deforestation (exporter only)
#   /api/v3/country_profiles/58/trajectory_deforestation?context_id=55&year=2015
# country_trajectory_import (importer only)
#   /api/v3/country_profiles/57/trajectory_import?commodity_id=6&year=2015
# country_indicators (exporter only)
#   /api/v3/country_profiles/58/indicators?context_id=55
# country_top_consumer_actors (importer)
#   /api/v3/country_profiles/57/top_consumer_actors?commodity_id=6&year=2015
# country_top_consumer_actors (exporter)
#   /api/v3/country_profiles/58/top_consumer_actors?context_id=55&year=2015
# country_top_consumer_countries (importer)
#   /api/v3/country_profiles/57/top_consumer_countries?commodity_id=6&year=2015
# country_top_consumer_countries (exporter)
#   /api/v3/country_profiles/58/top_consumer_countries?context_id=55&year=2015
