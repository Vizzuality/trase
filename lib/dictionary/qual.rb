module Dictionary
  class Qual < Attribute
    def find_by_name(name)
      Api::V3::Qual.
        select(:id, :name, 'qual_properties.display_name', 'qual_properties.tooltip_text').
        joins('LEFT JOIN qual_properties ON qual_properties.qual_id = quals.id').
        where(name: name).
        first
    end
  end
end
