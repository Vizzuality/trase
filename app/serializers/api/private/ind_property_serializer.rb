module Api
  module Private
    class IndPropertySerializer < ActiveModel::Serializer
      attributes :display_name, :unit_type, :tooltip_text
    end
  end
end
