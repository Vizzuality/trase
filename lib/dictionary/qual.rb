module Dictionary
  class Qual < Attribute
    def find_by_name(name)
      Api::V3::Qual.
        select(:id, :name, 'qual_properties.display_name', 'qual_properties.tooltip_text', :unit).
        joins(:qual_property).
        where(name: name).
        first
    end
  end
end
