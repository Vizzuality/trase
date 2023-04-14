# This service to be used as part of the importer script
# to amend any node ids stored in sankey_card_links.query_params
# that might have got out of sync.
module Api
  module V3
    module SankeyCardLinks
      class QueryParams
        include Singleton

        def cleanup(query_params)
          cleaned_query_params = query_params.dup
          all_query_param_wrappers = node_query_param_wrappers.merge(
            node_type_query_param_wrappers
          )
          all_query_param_wrappers.map do |qp_name, qp_wrapper|
            next unless cleaned_query_params[qp_name].present?

            cleaned_query_params[qp_name] = qp_wrapper.new(
              cleaned_query_params.delete(qp_name)
            ).cleaned_value
          end
          cleaned_query_params
        end

        def nodes_ids(query_params)
          node_query_param_wrappers.map do |qp_name, qp_wrapper|
            qp_wrapper.new(query_params[qp_name]).to_ary
          end.flatten.uniq
        end

        def node_query_param_wrappers
          {
            "selectedNodesIds" => ArrayList,
            "extraColumnNodeId" => SingleElement,
            "sources" => CommaSeparatedList,
            "companies" => CommaSeparatedList,
            "exporters" => CommaSeparatedList,
            "importers" => CommaSeparatedList,
            "destinations" => CommaSeparatedList
          }
        end

        def node_types_ids(query_params)
          node_type_query_param_wrappers.map do |qp_name, qp_wrapper|
            qp_wrapper.new(query_params[qp_name]).to_ary
          end.flatten.uniq
        end

        def node_type_query_param_wrappers
          {
            "selectedColumnsIds" => SankeyColumnsList
          }
        end
      end

      # list wrapper for array lists
      ArrayList = Struct.new(:value) do
        def to_ary
          return [] unless value.present?

          cleaned_value
        end

        def &(ary)
          to_ary & ary
        end

        def -(ary)
          to_ary - ary
        end

        def delete!(ary)
          self.value = to_ary - ary
        end

        def replace!(old_ary, new_ary)
          self.value = (to_ary - old_ary + new_ary)
        end

        def cleaned_value
          value.map(&:to_i)
        end
      end

      # list wrapper for single element
      SingleElement = Struct.new(:value) do
        def to_ary
          return [] unless value.present?

          [cleaned_value]
        end

        def &(ary)
          to_ary & ary
        end

        def -(ary)
          to_ary - ary
        end

        def delete!(ary)
          self.value = (to_ary - ary).first
        end

        def replace!(old_ary, new_ary)
          self.value = (to_ary - old_ary + new_ary).first
        end

        def cleaned_value
          value&.to_i
        end
      end

      # list wrapper for comma separated lists
      CommaSeparatedList = Struct.new(:value) do
        def excluded_prefix?
          value =~ /^excluded_/
        end

        def to_ary
          return [] unless value.present?

          value_to_split =
            if excluded_prefix?
              value.sub(/^excluded_/, "")
            else
              value
            end
          value_to_split.split(",").map(&:to_i)
        end

        def &(ary)
          to_ary & ary
        end

        def -(ary)
          to_ary - ary
        end

        def delete!(ary)
          joined_value = (to_ary - ary).join(",")
          update_value(joined_value)
        end

        def replace!(old_ary, new_ary)
          joined_value = (to_ary - old_ary + new_ary).join(",")
          update_value(joined_value)
        end

        def update_value(joined_value)
          if excluded_prefix?
            self.value = "excluded_#{joined_value}"
          else
            self.value = joined_value
          end
        end

        def cleaned_value
          value
        end
      end

      # list wrapper for mad sankey node types list format
      SankeyColumnsList = Struct.new(:value) do
        def columns_map
          return {} unless value.is_a? String

          Hash[
            value.split("-").map do |column_with_id|
              column, id = column_with_id.split("_").map(&:to_i)
            end
          ]
        end

        def columns_list(columns_map)
          columns_map.map do |column, id|
            "#{column}_#{id}"
          end.join("-")
        end

        def to_ary
          return [] unless value.present?

          columns_map.values.map(&:to_i)
        end

        def &(ary)
          to_ary & ary
        end

        def -(ary)
          to_ary - ary
        end

        def delete!(ary)
          keys_to_delete = ary.map { |e| columns_map.key(e) }
          new_columns_map = columns_map.except(*keys_to_delete)
          update_value(columns_list(new_columns_map))
        end

        def replace!(old_ary, new_ary)
          keys_to_update = old_ary.map { |e| columns_map.key(e) }
          new_columns_map = columns_map.except(*keys_to_update)
          keys_to_update.each.with_index do |key, idx|
            new_columns_map[key] = new_ary[idx]
          end
          update_value(columns_list(new_columns_map))
        end

        def update_value(joined_value)
          if !joined_value.blank?
            self.value = joined_value
          else
            self.value = nil
          end
        end

        def cleaned_value
          value
        end
      end
    end
  end
end
