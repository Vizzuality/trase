# == Schema Information
#
# Table name: facts
#
#  id             :integer          not null, primary key
#  attribute_id   :integer          not null
#  attribute_type :string(5)        not null
#  context_id     :integer          not null
#  type           :string(10)       not null
#

class Fact < ActiveRecord::Base


  self.inheritance_column = :ruby_type
  belongs_to :context, :class_name => 'Context', :foreign_key => :context_id
end
