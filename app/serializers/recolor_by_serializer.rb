class RecolorBySerializer < ActiveModel::Serializer
  attributes :is_default, :is_disabled, :group_number, :position, :legend_type, :legend_color_theme, :interval_count, :min_value, :max_value, :divisor

  attribute :type do
    object.recolor_attribute_type.downcase
  end

  attribute :name do
    object.recolor_attribute.name
  end

  attribute :label do
    object.recolor_attribute.frontend_name
  end

  attribute :description do
    object.tooltip_text
  end

  # TODO: workaround to enforce either true or false. Can be removed once old schema is dropped
  attribute :is_default do
    object.is_default.present?
  end

  # TODO: workaround to enforce either true or false. Can be removed once old schema is dropped
  attribute :is_disabled do
    object.is_disabled.present?
  end

  attribute :nodes do
    flows = []
    if object.legend_type.eql? 'qual'
      FlowQual.distinct.select('value').where('qual_id = ? AND value NOT ILIKE \'UNKNOWN%\'', object.recolor_attribute_id).each do |flow|
        flows.push(flow.value)
      end
    end
    flows
  end
end
