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

      after_commit :refresh_dependencies

      def chart_type
        case identifier
        when 'actor_top_countries', 'actor_top_sources'
          :line_chart_with_map
        when
          'actor_sustainability_table',
          'place_environmental_indicators',
          'place_socioeconomic_indicators',
          'place_agricultural_indicators',
          'place_territorial_governance',
          'place_indicators_table'
          :tabs_table
        when 'actor_exporting_companies'
          :scatterplot
        when 'place_trajectory_deforestation'
          :stacked_line_chart
        when 'place_top_consumer_actors', 'place_top_consumer_countries'
          :sankey
        end
      end

      def self.select_options
        Api::V3::Chart.includes(:profile).all.map do |chart|
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

      def refresh_dependencies
        Api::V3::Readonly::MapAttribute.refresh
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
    end
  end
end
