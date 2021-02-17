module Api
  module Private
    class QualPropertySerializer < ActiveModel::Serializer
      attributes :display_name, :tooltip_text
    end
  end
end
