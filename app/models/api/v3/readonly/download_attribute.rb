module Api
  module V3
    module Readonly
      class DownloadAttribute < Api::V3::Readonly::BaseModel
        self.table_name = 'revamp.download_attributes_mv'
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
