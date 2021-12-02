module Api
  module V3
    class MethodsAndDataDocSerializer < ActiveModel::Serializer
      attributes :context_id, :language, :language_name, :version, :url

      belongs_to :context
    end
  end
end
