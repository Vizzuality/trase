module Api
  module Private
    class QualContextPropertySerializer < ActiveModel::Serializer
      attributes :display_name, :tooltip_text
      belongs_to :context, serializer: Api::Private::ContextRefSerializer
    end
  end
end
