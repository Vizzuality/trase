module Api
  module V3
    module Contexts
      class Filter
        def call
          Api::V3::Context.
            includes(
              :country, :commodity, :context_property,
              readonly_recolor_by_attributes: :readonly_attribute,
              readonly_resize_by_attributes: :readonly_attribute,
              context_node_types: [:node_type, :profile]
            ).
            references(:context_property).
            where('NOT context_properties.is_disabled').
            select(&:is_visible?)
        end
      end
    end
  end
end
