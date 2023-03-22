module Api
  module V3
    module Import
      class Stats
        include Api::V3::Import::Tables

        def initialize(stats)
          @stats = stats || {}
        end

        def update_blue_table_before(blue_table_class, cnt_before)
          update_blue_table_key(blue_table_class, "before", cnt_before)
        end

        def update_blue_table_after(blue_table_class, cnt_after)
          update_blue_table_key(blue_table_class, "after", cnt_after)
        end

        def update_yellow_table_before(
            yellow_table_class, cnt_before, blue_table_name = nil
        )
          update_yellow_table_key(
            yellow_table_class, "before", cnt_before, blue_table_name
          )
        end

        def update_yellow_table_after(
            yellow_table_class, cnt_after, blue_table_name = nil
        )
          update_yellow_table_key(
            yellow_table_class, "after", cnt_after, blue_table_name
          )
        end

        def update_key(key, value)
          @stats[key.to_s] = value
        end

        def update_blue_table_key(blue_table_class, key, value)
          blue_table_name = blue_table_class.table_name
          ensure_nested_hash_exists(blue_table_name)
          @stats[blue_table_name][key.to_s] = value
        end

        def update_yellow_table_key(
            yellow_table_class, key, value, blue_table_name = nil
        )
          yellow_table_name = yellow_table_class.table_name
          blue_table_name ||= blue_table_name(yellow_table_class)
          return unless blue_table_name

          ensure_nested_hash_exists(
            blue_table_name, "yellow_tables", yellow_table_name
          )
          @stats[blue_table_name]["yellow_tables"][yellow_table_name][key.to_s] =
            value
        end

        def blue_table_name(yellow_table_class)
          blue_table_hash = ALL_TABLES.find do |table|
            table[:yellow_tables]&.include?(yellow_table_class)
          end
          blue_table_hash&.dig(:table_class)&.table_name
        end

        def ensure_nested_hash_exists(*path)
          nested_hash = @stats
          path.each do |key|
            nested_hash[key] ||= {}
            nested_hash = nested_hash[key]
          end
        end

        def to_h
          @stats
        end
      end
    end
  end
end
