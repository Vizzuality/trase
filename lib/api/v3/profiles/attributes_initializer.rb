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
            if attribute_hash[:attribute_type] == 'ind'
              Dictionary::Ind.instance
            elsif attribute_hash[:attribute_type] == 'quant'
              Dictionary::Quant.instance
            elsif attribute_hash[:attribute_type] == 'qual'
              Dictionary::Qual.instance
            end
          return nil unless dictionary
          attribute = dictionary.get(attribute_hash[:attribute_name])
          if attribute.nil?
            Rails.logger.debug 'NOT FOUND ' + attribute_hash[:attribute_name]
          end
          attribute
        end

        # @param profile_type [Symbol] either :actor or :place
        # @param identifier [Symbol] chart identifier
        def initialize_chart(profile_type, identifier)
          profile = @context.profiles.where(
            'context_node_types.node_type_id' => @node.node_type_id,
            name: profile_type
          ).first
          unless profile
            node_type = @node&.node_type&.name
            raise "Profile not configured: #{profile_type} for #{node_type}"
          end
          chart = profile.charts.
            where(identifier: identifier).
            first
          unless chart
            raise "Chart not configured: #{identifier} for #{profile_type}"
          end
          chart
        end

        # @param profile_type [Symbol] either :actor or :place
        # @param identifier [Symbol] chart identifier
        def attributes_list(profile_type, identifier)
          chart = initialize_chart(profile_type, identifier)
          chart.attributes_list
        end
      end
    end
  end
end
