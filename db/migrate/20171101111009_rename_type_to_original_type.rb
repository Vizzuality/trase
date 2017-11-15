class RenameTypeToOriginalType < ActiveRecord::Migration[5.0]
  include SearchPathHelpers
  include DependentAttributeViewsHelpers

  def up
    with_search_path('revamp') do
      drop_dependent_views

      update_view :attributes_mv,
        version: 2,
        revert_to_version: 1,
        materialized: true

      create_dependent_views(2)
    end
  end

  def down
    with_search_path('revamp') do
      drop_dependent_views

      update_view :attributes_mv,
        version: 1,
        revert_to_version: 1,
        materialized: true

      create_dependent_views(1)
    end
  end
end
