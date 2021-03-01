module Api
  module Private
    class QuantPropertySerializer < ActiveModel::Serializer
      attributes :display_name, :unit_type, :tooltip_text
    end
  end
end
