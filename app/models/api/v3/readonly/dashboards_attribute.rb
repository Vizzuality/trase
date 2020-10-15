# == Schema Information
#
# Table name: dashboards_attributes_v
#
#  id                                                    :bigint(8)        primary key
#  dashboards_attribute_group_id                         :bigint(8)
#  position                                              :integer
#  attribute_id(References the unique id in attributes.) :bigint(8)
#
module Api
  module V3
    module Readonly
      class DashboardsAttribute < Api::Readonly::BaseModel
        self.table_name = 'dashboards_attributes_v'
        belongs_to :readonly_attribute, foreign_key: :attribute_id, class_name: 'Attribute'

        delegate :name, to: :readonly_attribute
        delegate :display_name, to: :readonly_attribute
        delegate :original_type, to: :readonly_attribute
        delegate :original_id, to: :readonly_attribute
      end
    end
  end
end
