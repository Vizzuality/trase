module Api
  module Private
    class QuantContextPropertySerializer < ActiveModel::Serializer
      attributes :display_name, :tooltip_text
      belongs_to :context, serializer: Api::Private::ContextRefSerializer
    end
  end
end
