module Dictionary
  class Ind < Attribute
    def find_by_name(name)
      Api::V3::Ind.
        select(:id, :name, "ind_properties.display_name", "ind_properties.tooltip_text", :unit).
        joins("LEFT JOIN ind_properties ON ind_properties.ind_id = inds.id").
        where(name: name).
        first
    end
  end
end
