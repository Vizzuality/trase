module Api
  module V3
    module Profiles
      module AttributesInitializer
        def initialize_attributes(attributes_list)
          @attributes = attributes_list.map do |attribute_hash|
            attribute_hash.merge(
              attribute: initialize_attribute_from_hash(
                attribute_hash
              )
            )
          end
          @attributes = @attributes.select do |attribute_hash|
            attribute_hash && attribute_hash[:attribute].present?
          end
        end

        def initialize_attribute_from_hash(attribute_hash)
          dictionary =
            if attribute_hash[:attribute_type] == 'quant'
              Dictionary::Quant.instance
            elsif attribute_hash[:attribute_type] == 'ind'
              Dictionary::Ind.instance
            end
          return nil unless dictionary
          attribute = dictionary.get(attribute_hash[:attribute_name])
          if attribute.nil?
            Rails.logger.debug 'NOT FOUND ' + attribute_hash[:attribute_name]
          end
          attribute
        end
      end
    end
  end
end
