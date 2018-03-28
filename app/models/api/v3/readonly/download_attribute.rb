# == Schema Information
#
# Table name: download_attributes_mv
#
#  id           :integer          primary key
#  context_id   :integer
#  position     :integer
#  display_name :text
#  years        :integer          is an Array
#  created_at   :datetime
#  updated_at   :datetime
#  attribute_id :integer
#
# Indexes
#
#  download_attributes_mv_context_id_attribute_id_idx  (context_id,attribute_id)
#  download_attributes_mv_id_idx                       (id) UNIQUE
#

module Api
  module V3
    module Readonly
      class DownloadAttribute < Api::V3::Readonly::BaseModel
        self.table_name = 'download_attributes_mv'
        self.primary_key = 'id'

        belongs_to :context
        belongs_to :readonly_attribute, foreign_key: :attribute_id, class_name: 'Attribute'

        delegate :name, to: :readonly_attribute
        delegate :unit, to: :readonly_attribute
        delegate :unit_type, to: :readonly_attribute
        delegate :original_type, to: :readonly_attribute
        delegate :original_id, to: :readonly_attribute

        def self.refresh
          Scenic.database.refresh_materialized_view(table_name, concurrently: false)
          Api::V3::Readonly::DownloadFlow.refresh_later(skip_flow_paths: true)
        end
      end
    end
  end
end
