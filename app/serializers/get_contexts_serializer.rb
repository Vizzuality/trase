class GetContextsSerializer < ActiveModel::Serializer
  attributes :id, :is_default, :years, :default_year

  attribute :country_name do
    object.country.name
  end

  attribute :commodity_name do
    object.commodity.name
  end

  attribute :recolor_by do
    recolor_by_settings = []
    object.context_recolour_bies.each do |recolour_by|
      recolor_by_settings.push({
                                   isDefault: recolour_by.is_default?,
                                   isDisabled: recolour_by.is_disabled?,
                                   groupNumber: recolour_by.group_number,
                                   position: recolour_by.position,
                                   name: recolour_by.recolour_attribute.name,
                                   label: recolour_by.recolour_attribute.frontend_name,
                               })
    end
    recolor_by_settings
  end

  attribute :resize_by do
    resize_by_settings = []
    object.context_resize_bies.each do |resize_by|
      resize_by_settings.push({
                                  isDefault: resize_by.is_default?,
                                  isDisabled: resize_by.is_disabled?,
                                  groupNumber: resize_by.group_number,
                                  position: resize_by.position,
                                  name: resize_by.resize_attribute.name,
                                  label: resize_by.resize_attribute.frontend_name,
                              })
    end
    resize_by_settings
  end

  attribute :filter_by do
    filter_by_settings = []
    object.context_filter_bies.each do |filter_by|
      nodes = []

      filter_by.node_type.nodes.each do |node|
        nodes.push({
            node_id: node.id,
            name: node.name,
        }) unless node.name.eql?('OTHER') or node.name.starts_with?('UNKNOWN')
      end

      filter_by_settings.push({
                                  name: filter_by.node_type.node_type,
                                  nodes: nodes
                              })
    end
    filter_by_settings
  end

end
