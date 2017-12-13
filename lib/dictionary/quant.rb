module Dictionary
  class Quant < Attribute
    def find_by_name(name)
      Api::V3::Quant.select(:id, :name, 'quant_properties.display_name', :unit).
        joins(:quant_property).
        where(name: name).
        first
    end
  end
end
