# == Schema Information
#
# Table name: qual_properties
#
#  id                                                     :integer          not null, primary key
#  qual_id                                                :integer          not null
#  display_name(Name of attribute for display)            :text             not null
#  tooltip_text(Generic tooltip text (lowest precedence)) :text
#
# Indexes
#
#  qual_properties_qual_id_key  (qual_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (qual_id => quals.id) ON DELETE => cascade ON UPDATE => cascade
#

module Api
  module V3
    class QualProperty < YellowTable
      belongs_to :qual

      validates :qual, presence: true, uniqueness: true
      validates :display_name, presence: true

      after_commit :refresh_dependents

      def self.blue_foreign_keys
        [
          {name: :qual_id, table_class: Api::V3::Qual}
        ]
      end

      def refresh_dependents
        Api::V3::Readonly::Attribute.refresh
      end
    end
  end
end
