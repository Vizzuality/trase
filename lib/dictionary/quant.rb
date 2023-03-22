module Dictionary
  class Quant < Attribute
    def find_by_name(name)
      Api::V3::Quant.
        select(:id, :name, "quant_properties.display_name", "quant_properties.tooltip_text", :unit).
        joins("LEFT JOIN quant_properties ON quant_properties.quant_id = quants.id").
        where(name: name).
        first
    end
  end
end
