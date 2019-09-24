class MakeRoleAndPrefixMandatory < ActiveRecord::Migration[5.2]
  def change
    reversible do |dir|
      dir.up do
        Api::V3::ContextNodeTypeProperty.skip_callback(:commit, :after, :refresh_dependents)
        Api::V3::ContextNodeTypeProperty.all.each do |cnt_prop|
          cnt_prop.role ||= Api::V3::ContextNodeTypeProperty::DEFAULT_ROLES[cnt_prop.column_group]
          cnt_prop.prefix ||= Api::V3::ContextNodeTypeProperty::DEFAULT_PREFIXES[cnt_prop.column_group]
          cnt_prop.save!
        end
        Api::V3::ContextNodeTypeProperty.set_callback(:commit, :after, :refresh_dependents)
        Api::V3::Readonly::Dashboards::Source.refresh_later
        Api::V3::Readonly::Dashboards::Company.refresh_later
        Api::V3::Readonly::Dashboards::Destination.refresh_later
      end
    end

    change_column_null(:context_node_type_properties, :role, false)
    change_column_null(:context_node_type_properties, :prefix, false)
  end
end
