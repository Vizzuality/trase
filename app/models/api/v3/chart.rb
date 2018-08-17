# == Schema Information
#
# Table name: charts
#
#  id         :integer          not null, primary key
#  profile_id :integer          not null
#  parent_id  :integer
#  identifier :text             not null
#  title      :text             not null
#  position   :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  charts_profile_id_parent_id_position_key  (profile_id,parent_id,position) UNIQUE
#  index_charts_on_parent_id                 (parent_id)
#  index_charts_on_profile_id                (profile_id)
#
# Foreign Keys
#
#  fk_rails_...  (parent_id => charts.id) ON DELETE => cascade
#  fk_rails_...  (profile_id => profiles.id) ON DELETE => cascade
#

module Api
  module V3
    class Chart < YellowTable
      belongs_to :profile

      def self.yellow_foreign_keys
        [
          {name: :profile_id, table_class: Api::V3::Profile}
        ]
      end
    end
  end
end
