require "active_support/concern"
module Api
  module V3
    module AssociatedAttributes
      extend ActiveSupport::Concern

      class_methods do
        def manage_associated_attributes(ary)
          @associated_attributes = ary

          @associated_attributes.each do |attr_name|
            define_method(:"new_#{attr_name}_given?") do
              send(attr_name).present? && !send(attr_name).marked_for_destruction?
            end
          end
        end

        def associated_attributes
          @associated_attributes
        end

        def destroy_zombies
          zombies = all
          zombies = zombies.where("id NOT IN (?)", active_ids) if active_ids.any?
          zombies.destroy_all
        end
      end

      def readonly_attribute_id
        readonly_attribute&.id
      end

      def readonly_attribute_display_name
        "#{readonly_attribute&.display_name} (#{readonly_attribute&.name})"
      end

      def readonly_attribute_name
        readonly_attribute&.name
      end

      def readonly_attribute_id=(id)
        self.readonly_attribute = Api::V3::Readonly::Attribute.find_by_id(id)
      end

      def readonly_attribute
        return @readonly_attribute if defined?(@readonly_attribute)

        @readonly_attribute = original_attribute&.readonly_attribute
      end

      def original_chart_attribute
        return @original_chart_attribute if defined?(@original_chart_attribute)

        @original_chart_attribute = find_original_chart_attribute
      end

      def original_attribute
        return @original_attribute if defined?(@original_attribute)

        @original_attribute = find_original_attribute
      end

      private

      def associated_attributes
        self.class.instance_variable_get(:@associated_attributes)
      end

      # iterates over declared associated chart attributes
      # returns the first actual associated chart attribute found
      def find_original_chart_attribute
        associated_attributes.map do |attr_name|
          original_chart_attribute = send(attr_name)
          break original_chart_attribute if original_chart_attribute.present?

          false
        end
      end

      # iterates over declared associated chart attributes
      # returns the first actual associated original attribute found
      def find_original_attribute
        assoc_attr_names_with_types.detect do |attr_name, attr_type|
          original_attribute = send(attr_name)&.send(attr_type)
          break original_attribute if original_attribute.present?

          false
        end
      end

      def readonly_attribute=(readonly_attribute)
        return unless readonly_attribute

        assoc_attr_names_with_types.each do |attr_name, attr_type|
          assign_associated_object(readonly_attribute, attr_name, attr_type)
        end
      end

      def assign_associated_object(readonly_attribute, attr_name, attr_type)
        assoc_obj = send(attr_name)
        if readonly_attribute.original_type != attr_type.capitalize
          # delete when saving parent
          send(attr_name)&.mark_for_destruction
        elsif assoc_obj
          # update existing associated object with new attribute id
          assoc_obj.send(:"#{attr_type}_id=", readonly_attribute.original_id)
        else
          # build a new associated object (saved with parent)
          send(:"build_#{attr_name}", :"#{attr_type}_id" => readonly_attribute.original_id)
        end
      end

      def assoc_attr_names_with_types
        associated_attributes.map do |attr_name|
          attr_type = attr_name.to_s.split("_").last
          raise "Cannot infer type from #{attr_name}" unless attr_type
          [attr_name, attr_type]
        end
      end
    end
  end
end
