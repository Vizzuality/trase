module Api
  module V3
    module ProfileMetadata
      class AvailableYearsSerializer < ActiveModel::Serializer
        attributes :available_years

        def available_years
          object.years
        end
      end
    end
  end
end
