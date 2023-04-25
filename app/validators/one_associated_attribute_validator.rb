# Used in download_attributes, map_attributes, recolor_by_attributes
# and resize_by attributes
# which all have has_one associations, sometimes multiple
# e.g. map_ind, map_quant
# to ensure only one of those exists at a given time
class OneAssociatedAttributeValidator < ActiveModel::Validator
  def validate(record)
    return unless options.key?(:attributes)
    attributes = options[:attributes]
    count = 0
    attributes.each do |attr_sym|
      attribute = record.send(attr_sym)
      count += 1 if attribute.present? && !attribute.marked_for_destruction?
    end
    return if count <= 1
    record.errors.add(
      :base,
      "can only be associated with one of #{attributes.join(", ")}"
    )
  end
end
