# == Schema Information
#
# Table name: download_attributes_v
#
#  id                                                    :integer          primary key
#  attribute_id(References the unique id in attributes.) :bigint(8)
#  context_id                                            :integer
#  original_id                                           :integer
#  position                                              :integer
#  years                                                 :integer          is an Array
#  original_type                                         :text
#  display_name                                          :text
#
module Api
  module V3
    module Readonly
      class DownloadAttribute < Api::Readonly::BaseModel
        self.table_name = 'download_attributes_v'
        self.primary_key = 'id'

        belongs_to :context
        belongs_to :readonly_attribute, foreign_key: :attribute_id, class_name: 'Attribute'

        delegate :name, to: :readonly_attribute
        delegate :unit, to: :readonly_attribute
        delegate :unit_type, to: :readonly_attribute
        delegate :original_type, to: :readonly_attribute
        delegate :original_id, to: :readonly_attribute
      end
    end
  end
end
