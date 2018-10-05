# == Schema Information
#
# Table name: attributes_mv
#
#  id                           :integer          primary key
#  original_type                :text
#  original_id                  :integer
#  name                         :text
#  display_name                 :text
#  unit                         :text
#  unit_type                    :text
#  tooltip_text                 :text
#  is_visible_on_actor_profile  :boolean
#  is_visible_on_place_profile  :boolean
#  is_temporal_on_actor_profile :boolean
#  is_temporal_on_place_profile :boolean
#  aggregate_method             :text
#
# Indexes
#
#  attributes_mv_name_idx      (name) UNIQUE
#  index_attributes_mv_id_idx  (id) UNIQUE
#

module Api
  module V3
    module Readonly
      class Attribute < Api::V3::Readonly::BaseModel
        self.table_name = 'attributes_mv'
        self.primary_key = 'id'

        def self.select_options
          order(:display_name).map { |a| [a.display_name, a.id] }
        end

        def self.refresh_dependents(options = {})
          [
            Api::V3::Readonly::DownloadAttribute,
            Api::V3::Readonly::MapAttribute,
            Api::V3::Readonly::RecolorByAttribute,
            Api::V3::Readonly::ResizeByAttribute,
            Api::V3::Readonly::DashboardsAttribute
          ].each do |mview_klass|
            mview_klass.refresh(options.merge(skip_dependencies: true))
          end
        end
      end
    end
  end
end
