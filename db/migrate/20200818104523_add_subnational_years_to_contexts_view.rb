# TODO: conditional migration, compatible with versions of code working both
# with old materialised view and new regular view
class AddSubnationalYearsToContextsView < ActiveRecord::Migration[5.2]
  def up
    update_view_if_exists :contexts_mv, materialized: true, version: 2, revert_to_version: 1
    update_view_if_exists :contexts_v, materialized: false, version: 2, revert_to_version: 1
  end

  def down
    update_view_if_exists :contexts_mv, materialized: true, version: 1, revert_to_version: 2
    update_view_if_exists :contexts_v, materialized: false, version: 1, revert_to_version: 2
  end

  def update_view_if_exists(view_name, options)
    return unless view_exists? view_name

    filename = "db/views/#{view_name}_v#{"%02d" % options[:version]}.sql"
    return unless File.exists?(filename)

    update_view view_name, options
  end
end
