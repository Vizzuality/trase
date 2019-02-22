class AddChartTypeToCharts < ActiveRecord::Migration[5.2]
  def change
    add_column :charts, :chart_type, :string

    [
      {
        chart_type: :line_chart_with_map,
        charts: [:actor_top_countries, :actor_top_sources]
      },
      {
        chart_type: :tabs_table,
        charts: [
          :actor_sustainability_table,
          :place_environmental_indicators,
          :place_socioeconomic_indicators,
          :place_agricultural_indicators,
          :place_territorial_governance,
          :place_indicators_table
        ]
      },
      {
        chart_type: :scatterplot,
        charts: [:actor_exporting_companies]
      },
      {
        chart_type: :stacked_line_chart,
        charts: [:place_trajectory_deforestation]
      },
      {
        chart_type: :sankey,
        charts: [:place_top_consumer_actors, :place_top_consumer_countries]
      }
    ].each do |chart_options|
      Api::V3::Chart.
        where(identifier: chart_options[:charts]).
        update_all(chart_type: chart_options[:chart_type])
    end
  end
end
