class MakeRoleAndPrefixMandatory < ActiveRecord::Migration[5.2]
  def change
    reversible do |dir|
      dir.up do
        Api::V3::ContextNodeTypeProperty.all.each do |cnt_prop|
          cnt_prop.role ||= Api::V3::ContextNodeTypeProperty::DEFAULT_ROLES[cnt_prop.column_group]
          cnt_prop.prefix ||= Api::V3::ContextNodeTypeProperty::DEFAULT_PREFIXES[cnt_prop.column_group]
          cnt_prop.save!
        end
      end
    end

    change_column_null(:context_node_type_properties, :role, false)
    change_column_null(:context_node_type_properties, :prefix, false)
  end
end
