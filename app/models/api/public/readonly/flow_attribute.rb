# == Schema Information
#
# Table name: flow_attributes
#
#  attribute_id    :integer          not null
#  context_id      :integer          not null
#  years           :integer          is an Array
#  name            :text
#  display_name    :text
#  unit            :text
#  unit_type       :text
#  distinct_values :text             is an Array
#
module Api
  module Public
    module Readonly
      class FlowAttribute < Api::Readonly::BaseModel
        include Api::V3::Readonly::MaterialisedTable

        self.table_name = 'flow_attributes'

        INDEXES = [].freeze

        belongs_to :context

        validates :name, presence: true
      end
    end
  end
end
