module Api
  module Private
    class ContextPropertySerializer < ActiveModel::Serializer
      attributes :default_basemap, :is_disabled, :is_default, :is_highlighted
    end
  end
end
