# == Schema Information
#
# Table name: flow_attributes_mv
#
#  name         :text
#  display_name :text
#  unit         :text
#  context_id   :integer
#  years        :integer          is an Array
#
# Indexes
#
#  flow_attributes_mv_name_display_name_unit_context_idx  (name,display_name,unit,context_id) UNIQUE
#

module Api
  module Public
    module Readonly
      class FlowAttribute < Api::Readonly::BaseModel
        self.table_name = 'flow_attributes_mv'

        belongs_to :context

        validates :name, presence: true
      end
    end
  end
end
