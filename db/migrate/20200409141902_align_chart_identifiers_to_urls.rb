class AlignChartIdentifiersToUrls < ActiveRecord::Migration[5.2]
  def up
    Api::V3::Chart.where(
      identifier: :country_indicators_table
    ).update_all(identifier: :country_indicators)
    Api::V3::Chart.where(
      identifier: :place_indicators_table
    ).update_all(identifier: :place_indicators)
    Api::V3::Chart.where(
      identifier: :actor_sustainability_table
    ).update_all(identifier: :actor_sustainability)
  end

  def down
    Api::V3::Chart.where(
      identifier: :indicators_table
    ).update_all(identifier: :country_indicators_table)
    Api::V3::Chart.where(
      identifier: :place_indicators
    ).update_all(identifier: :place_indicators_table)
    Api::V3::Chart.where(
      identifier: :actor_sustainability
    ).update_all(identifier: :actor_sustainability_table)
  end
end
