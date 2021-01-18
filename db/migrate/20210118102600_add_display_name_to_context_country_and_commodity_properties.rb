class AddDisplayNameToContextCountryAndCommodityProperties < ActiveRecord::Migration[5.2]
  def change
    reversible do |dir|
      dir.up do
        # add new column without not null constraint
        add_column :ind_context_properties, :display_name, :text
        add_column :ind_country_properties, :display_name, :text
        add_column :ind_commodity_properties, :display_name, :text

        add_column :qual_context_properties, :display_name, :text
        add_column :qual_country_properties, :display_name, :text
        add_column :qual_commodity_properties, :display_name, :text

        add_column :quant_context_properties, :display_name, :text
        add_column :quant_country_properties, :display_name, :text
        add_column :quant_commodity_properties, :display_name, :text

        ['ind', 'qual', 'quant'].each do |attribute_type|
          ['context', 'country', 'commodity'].each do |property_type|
            properties_table_name = "#{attribute_type}_#{property_type}_properties"
            generic_properties_table_name = "#{attribute_type}_properties"
            update_sql =<<-SQL
            WITH generic_properties (attribute_id, display_name) AS (
              SELECT attributes.id AS attribute_id, COALESCE (properties.display_name, attributes.name)
              FROM #{attribute_type}s attributes
              LEFT JOIN #{generic_properties_table_name} properties ON attributes.id = properties.#{attribute_type}_id
            )
            UPDATE #{properties_table_name} properties
            SET display_name = generic_properties.display_name
            FROM generic_properties
            WHERE properties.#{attribute_type}_id = generic_properties.attribute_id
            SQL
            execute update_sql
          end
        end

        # add not null constraint
        change_column_null :ind_context_properties, :display_name, false
        change_column_null :ind_country_properties, :display_name, false
        change_column_null :ind_commodity_properties, :display_name, false

        change_column_null :qual_context_properties, :display_name, false
        change_column_null :qual_country_properties, :display_name, false
        change_column_null :qual_commodity_properties, :display_name, false

        change_column_null :quant_context_properties, :display_name, false
        change_column_null :quant_country_properties, :display_name, false
        change_column_null :quant_commodity_properties, :display_name, false
      end

      dir.down do |dir|
        remove_column :ind_context_properties, :display_name, :text
        remove_column :ind_country_properties, :display_name, :text
        remove_column :ind_commodity_properties, :display_name, :text

        remove_column :qual_context_properties, :display_name, :text
        remove_column :qual_country_properties, :display_name, :text
        remove_column :qual_commodity_properties, :display_name, :text

        remove_column :quant_context_properties, :display_name, :text
        remove_column :quant_country_properties, :display_name, :text
        remove_column :quant_commodity_properties, :display_name, :text
      end
    end
  end
end
