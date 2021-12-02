module Api
  module V3
    module Contexts
      class Filter
        def call
          Api::V3::Readonly::Context.
            includes(
              :context_node_types,
              :methods_and_data_docs,
              country: :country_property,
              readonly_recolor_by_attributes: :readonly_attribute,
              readonly_resize_by_attributes: :readonly_attribute
            ).where(
              "node_types_by_role->'exporter' IS NOT NULL AND node_types_by_role->'destination' IS NOT NULL"
            ).where(is_disabled: false)
        end
      end
    end
  end
end
