module Dictionary
  class Ind < Attribute
    def find_by_name(name)
      Api::V3::Ind.select(:id, :name, 'ind_properties.display_name', :unit).
        joins(:ind_property).
        where(name: name).
        first
    end
  end
end
