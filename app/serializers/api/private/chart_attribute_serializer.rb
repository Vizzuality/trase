module Api
  module Private
    class ChartAttributeSerializer < ActiveModel::Serializer
      attributes  :position,
                  :years,
                  :display_name,
                  :legend_name,
                  :display_type,
                  :display_style,
                  :state_average,
                  :identifier
      has_one :chart_ind, serializer: Api::Private::ChartIndSerializer
      has_one :chart_qual, serializer: Api::Private::ChartQualSerializer
      has_one :chart_quant, serializer: Api::Private::ChartQuantSerializer
    end
  end
end
