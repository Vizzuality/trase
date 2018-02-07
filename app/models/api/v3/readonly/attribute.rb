module Api
  module V3
    module Readonly
      class Attribute < Api::V3::Readonly::BaseModel
        self.table_name = 'revamp.attributes_mv'
        self.primary_key = 'id'

        def self.select_options
          order(:display_name).map { |a| [a.display_name, a.id] }
        end

        def self.refresh
          super
          dependents.each(&:refresh)
        end

        def self.dependents
          [
            Api::V3::Readonly::DownloadAttribute,
            Api::V3::Readonly::MapAttribute,
            Api::V3::Readonly::RecolorByAttribute,
            Api::V3::Readonly::ResizeByAttribute
          ]
        end
      end
    end
  end
end
