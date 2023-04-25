require "active_support/concern"
module Api
  module V3
    module StringyArray
      extend ActiveSupport::Concern

      class_methods do
        def stringy_array(attr_name)
          define_method(:"#{attr_name}_str=") do |str|
            str_to_ary = str&.split(",")&.map(&:strip) || []
            write_attribute(attr_name, str_to_ary)
          end
          define_method(:"#{attr_name}_str") do
            read_attribute(attr_name)&.join(", ")
          end
        end
      end
    end
  end
end
