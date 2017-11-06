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

  attribute :nodes do
    flows = []
    if (object.legend_type.eql? 'qual')
      FlowQual.distinct.select('value').where('qual_id = ? AND value NOT ILIKE \'UNKNOWN%\'', object.recolor_attribute_id).each do |flow|
        flows.push(flow.value)
      end
    end
    flows
  end
end
