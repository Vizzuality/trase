# == Schema Information
#
# Table name: flow_attributes_mv
#
#  attribute_id :bigint(8)
#  name         :text
#  display_name :text
#  unit         :text
#  unit_type    :text
#  context_id   :integer
#  years        :integer          is an Array
#
# Indexes
#
#  flow_attributes_mv_attribute_id_context_id_idx  (attribute_id,context_id) UNIQUE
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
