# == Schema Information
#
# Table name: charts
#
#  id                                                                                                                      :integer          not null, primary key
#  profile_id                                                                                                              :integer          not null
#  parent_id(Self-reference to parent used to define complex charts, e.g. table with values in tabs)                       :integer
#  identifier(Identifier used to map this chart to a part of code which contains calculation logic)                        :text             not null
#  title(Title of chart for display; you can use {{commodity_name}}, {{company_name}}, {{jurisdiction_name}} and {{year}}) :text             not null
#  position(Display order in scope of profile)                                                                             :integer          not null
#
# Indexes
#
#  charts_parent_id_idx                        (parent_id)
#  charts_profile_id_parent_id_identifier_key  (profile_id,parent_id,identifier) UNIQUE
#  charts_profile_id_parent_id_position_key    (profile_id,parent_id,position) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (parent_id => charts.id) ON DELETE => cascade
#  fk_rails_...  (profile_id => profiles.id) ON DELETE => cascade
#
module Api
  module V3
    class Chart < YellowTable
      belongs_to :profile, optional: false
      belongs_to :parent, class_name: 'Chart', optional: true
      has_many :children, -> { order(:position) },
               {class_name: 'Chart', foreign_key: :parent_id}
      has_many :chart_attributes, dependent: :delete_all
      has_many :readonly_chart_attributes,
               class_name: 'Readonly::ChartAttribute'
      has_many :chart_node_types, dependent: :delete_all

      validates :identifier,
                presence: true, uniqueness: {scope: [:profile_id, :parent_id]}
      validates :title, presence: true
      validates :position,
                presence: true, uniqueness: {scope: [:profile_id, :parent_id]}
      validate :parent_is_in_same_profile
      validate :parent_is_root
      validate :identifier_is_supported

      after_commit :refresh_dependents

      ACTOR_CHARTS = %w(
        actor_basic_attributes
        actor_top_countries
        actor_top_sources
        actor_sustainability
        actor_exporting_companies
      ).freeze
      PLACE_CHARTS = %w(
        place_basic_attributes
        place_indicators
        place_trajectory_deforestation
        place_top_consumer_actors
        place_top_consumer_countries
      ).freeze
      EXPORTER_COUNTRY_CHARTS = %w(
        country_basic_attributes
        country_commodity_exports
        country_trajectory_deforestation
        country_indicators
        country_top_consumer_actors
        country_top_consumer_countries
      ).freeze
      IMPORTER_COUNTRY_CHARTS = %w(
        country_basic_attributes
        country_commodity_imports
        country_trajectory_import
        country_top_consumer_actors
        country_top_consumer_countries
      ).freeze

      def chart_type
        case identifier
        when 'actor_top_countries', 'actor_top_sources'
          :line_chart_with_map
        when
          'actor_sustainability',
          'place_environmental_indicators',
          'place_socioeconomic_indicators',
          'place_agricultural_indicators',
          'place_territorial_governance',
          'place_indicators',
          'country_indicators'
          :tabs_table
        when
          'country_commodity_exports',
          'country_commodity_imports'
          :table
        when 'actor_exporting_companies'
          :scatterplot
        when
          'place_trajectory_deforestation',
          'country_trajectory_defofestation'
          :stacked_line_chart
        when 'country_trajectory_import'
          :line_chart
        when
          'place_top_consumer_actors',
          'place_top_consumer_countries',
          'country_top_consumer_actors'
          :sankey
        when
          'country_top_consumer_countries'
          :map_with_flows
        end
      end

      def self.select_options
        Api::V3::Chart.includes(
          profile: {context_node_type: [{context: [:country, :commodity]}, :node_type]}
        ).order(
          'countries.name, commodities.name, node_types.name'
        ).all.map do |chart|
          profile = chart.profile
          context_node_type = profile&.context_node_type
          context = context_node_type&.context
          [
            [
              context&.country&.name,
              context&.commodity&.name,
              context_node_type&.node_type&.name,
              profile&.name,
              chart.identifier
            ].join(' / '),
            chart.id
          ]
        end
      end

      def self.yellow_foreign_keys
        [
          {name: :profile_id, table_class: Api::V3::Profile}
        ]
      end

      def refresh_dependents
        refresh_actor_basic_attributes
      end

      def refresh_actor_basic_attributes
        return unless saved_change_to_identifier? ||
          saved_change_to_profile_id?

        # Update previous NodeWithFlows
        # The behaviour is the same if the identifier or the profile_id changes
        if profile_id_before_last_save
          update_node_with_flows_actor_basic_attributes(
            profile_id_before_last_save
          )
        end

        # If we have just updated the identifier, it has already been updated
        return unless saved_change_to_profile_id

        # Update new NodeWithFlows
        update_node_with_flows_actor_basic_attributes(profile_id)
      end

      def update_node_with_flows_actor_basic_attributes(profile_id)
        profile = Api::V3::Profile.find(profile_id)
        nodes_ids = Api::V3::Readonly::NodeWithFlows.
          where(context_node_type_id: profile.context_node_type_id).
          without_unknowns.
          without_domestic.
          pluck(:id)
        NodeWithFlowsRefreshActorBasicAttributesWorker.perform_async(
          nodes_ids.uniq
        )
      end

      protected

      def parent_is_in_same_profile
        return if parent.nil? || parent.profile_id == profile_id

        errors.add(:parent, 'cannot belong to a different profile')
      end

      def parent_is_root
        return if parent.nil? || parent.parent.nil?

        errors.add(:parent, 'cannot be a nested chart')
      end

      def identifier_is_supported
        return unless profile.present? && parent.nil?

        profile_type = profile.name
        supported_identifiers =
          case profile_type
          when Api::V3::Profile::ACTOR
            ACTOR_CHARTS
          when Api::V3::Profile::PLACE
            PLACE_CHARTS
          when Api::V3::Profile::COUNTRY
            (EXPORTER_COUNTRY_CHARTS + IMPORTER_COUNTRY_CHARTS).uniq
          end

        return if supported_identifiers.include?(identifier)

        errors.add(
          :identifier,
          "not supported, select one of: #{supported_identifiers.join(', ')}"
        )
      end
    end
  end
end
