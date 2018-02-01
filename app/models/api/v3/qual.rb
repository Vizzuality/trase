module Api
  module V3
    class Qual < BlueTable
      has_one :qual_property
      delegate :display_name, to: :qual_property

      def self.import_key
        [
          {name: :name, sql_type: 'TEXT'}
        ]
      end
    end
  end
end
