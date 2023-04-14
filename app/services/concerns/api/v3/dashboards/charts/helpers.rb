module Api
  module V3
    module Dashboards
      module Charts
        module Helpers
          private

          def axis_meta(attribute, type)
            name_and_tooltip = Api::V3::AttributeNameAndTooltip.call(
              attribute: attribute,
              context: @context,
              defaults: Api::V3::AttributeNameAndTooltip::NameAndTooltip.new(attribute.display_name, attribute.tooltip_text)
            )
            {
              type: type,
              label: name_and_tooltip.display_name,
              prefix: "",
              format: "",
              suffix: attribute.unit
            }
          end

          def year_axis_meta
            {
              type: "category", # category || date || number
              label: "Year",
              prefix: "",
              format: "",
              suffix: ""
            }
          end

          def legend_meta(attribute)
            {
              label: attribute.display_name,
              tooltip: {prefix: "", format: "", suffix: attribute.unit}
            }
          end

          def year_legend_meta
            {
              label: "Year", tooltip: {prefix: "", format: "", suffix: ""}
            }
          end

          def apply_single_year_filter
            @query = @query.where(year: @year)
          end

          def apply_multi_year_filter
            @query = @query.where("year BETWEEN ? AND ?", @start_year, @end_year)
          end

          def apply_year_x
            @query = @query.select("year AS x").group(:year)
          end

          def profile_for_node_type_id(node_type_id)
            profiles_by_node_type_id[node_type_id]&.name
          end

          def profiles_by_node_type_id
            return @profiles_by_node_type_id if defined? @profiles_by_node_type_id

            context_node_types_with_profiles = @context.context_node_types.
              includes(:profile)
            @profiles_by_node_type_id = Hash[
              context_node_types_with_profiles.map { |cnt| [cnt.node_type_id, cnt.profile] }
            ]
          end
        end
      end
    end
  end
end
