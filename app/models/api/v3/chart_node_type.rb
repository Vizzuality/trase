# == Schema Information
#
# Table name: chart_node_types
#
#  id           :bigint(8)        not null, primary key
#  chart_id     :bigint(8)
#  node_type_id :bigint(8)
#  identifier   :text
#  position     :integer
#  is_total     :boolean          default(FALSE)
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
# Indexes
#
#  chart_node_types_chart_id_identifier_position_key  (chart_id,identifier,position) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (chart_id => charts.id)
#  fk_rails_...  (node_type_id => node_types.id)
#
module Api
  module V3
    class ChartNodeType < YellowTable
      belongs_to :chart, optional: false
      belongs_to :node_type, optional: false

      validates :identifier,
                presence: true,
                uniqueness: {scope: [:chart, :position]},
                if: proc { |chart_nt| chart_nt.position.present? }
      validates :identifier,
                presence: true,
                uniqueness: {scope: :chart},
                if: proc { |chart_nt| chart_nt.position.blank? }

      def self.yellow_foreign_keys
        [
          {name: :chart_id, table_class: Api::V3::Chart},
          {name: :node_type_id, table_class: Api::V3::NodeType}
        ]
      end
    end
  end
end
