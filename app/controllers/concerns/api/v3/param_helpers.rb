module Api
  module V3
    module ParamHelpers
      def string_to_int(str)
        str&.to_i
      end

      def cs_string_to_int_array(str)
        str&.split(",")&.map(&:to_i) || []
      end
    end
  end
end
