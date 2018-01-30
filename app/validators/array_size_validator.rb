class ArraySizeValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    return unless options.key?(:exactly)
    array_size = (value.try(:size) || 0)
    expected_size = options[:exactly]
    return if array_size == expected_size
    record.errors.add(attribute, :invalid_size, size: expected_size)
  end
end
