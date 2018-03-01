# Used in download_attributes, map_attributes, recolor_by_attributes
# and resize_by attributes
# to ensure that any attribute (ind / qual / quant) is only assigned once
# in a given scope (the scope will typically be a context)
class AttributeAssociatedOnceValidator < ActiveModel::Validator
  def validate(record)
    return unless options.key?(:attribute)
    attribute = options[:attribute]
    # e.g. map_ind
    attribute_association_name = attribute
    # e.g. ind
    attribute_name = attribute.to_s.split('_').last
    # e.g. ind_id
    attribute_id_name = "#{attribute_name}_id"
    attribute_id = record.send(attribute_association_name)&.send(attribute_id_name)
    scope_attribute_name = "#{options[:scope] || :context}_id"
    existing_assignments = record.class.joins(attribute_association_name).where(
      "#{attribute_association_name}s.#{attribute_name}_id" => attribute_id,
      scope_attribute_name => record.send(scope_attribute_name)
    )
    if record.persisted?
      existing_assignments = existing_assignments.where(
        "#{record.class.table_name}.id <> ?", record.id
      )
    end
    return if existing_assignments.reject(&:marked_for_destruction?).empty?
    record.errors.add(
      :base,
      "#{attribute_name} can only be listed once per context"
    )
  end
end
