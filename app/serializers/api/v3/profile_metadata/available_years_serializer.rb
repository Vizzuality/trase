module Api
  module V3
    module ProfileMetadata
      class AvailableYearsSerializer < ActiveModel::Serializer
        attributes :available_years

        def available_years
          if object.readonly_attribute
            object.readonly_attribute.years
          else
            nil
          end
        end
      end
    end
  end
end
