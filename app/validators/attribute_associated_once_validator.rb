# Used in download_attributes, map_attributes, recolor_by_attributes,
# resize_by attributes, dashboard_attributes and chart_attributes
# to ensure that any attribute (ind / qual / quant) is only assigned once
# in a given scope (the scope will typically be a context_id)
class AttributeAssociatedOnceValidator < ActiveModel::Validator
  def validate(record)
    return unless options.key?(:attribute)

    attribute = options[:attribute]
    # e.g. map_ind
    attribute_association_name = attribute
    # e.g. ind
    attribute_name = attribute.to_s.split("_").last
    # e.g. ind_id
    attribute_id_name = "#{attribute_name}_id"
    attribute_id = record.send(attribute_association_name)&.send(attribute_id_name)

    existing_assignments = record.class.joins(attribute_association_name).where(
      "#{attribute_association_name}s.#{attribute_name}_id" => attribute_id
    )

    scope_attribute_names = scope_attribute_names(options[:scope])
    existing_assignments = apply_scope(
      record, existing_assignments, scope_attribute_names
    )

    if record.persisted?
      existing_assignments = existing_assignments.where(
        "#{record.class.table_name}.id <> ?", record.id
      )
    end
    return if existing_assignments.reject(&:marked_for_destruction?).empty?

    record.errors.add(
      :base,
      "#{attribute_name} can only be listed once per #{scope_attribute_names}"
    )
  end

  def scope_attribute_names(scope)
    if scope && !scope.is_a?(Array)
      [scope]
    else
      scope || [:context_id]
    end
  end

  def apply_scope(record, existing_assignments, scope_attribute_names)
    scope_attribute_names.each do |scope_attribute_name|
      existing_assignments = existing_assignments.where(
        scope_attribute_name => record.send(scope_attribute_name)
      )
    end
    existing_assignments
  end
end
