class UrlValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    begin
      url = URI.parse(value)
      true
    rescue StandardError => error
      record.errors[attribute] << "Web address is invalid"
      false
    end
  end
end
