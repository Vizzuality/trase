module Api
  module V3
    module Dashboards
      class RetrieveAttributesMeta
        def call
          Api::V3::DashboardsAttributeGroup.
            select(:id, :name).
            order(:position).
            all
        end
      end
    end
  end
end
