module Api
  module V3
    module DatabaseValidation
      class ErrorsList
        attr_reader :errors

        def initialize
          @errors = []
        end

        def add(options)
          object = options.delete(:object)
          table = object.class.table_name
          id = object.id
          @errors << {table: table, id: id}.merge(options)
        end

        def error_count
          @errors.reject { |e| e[:severity] == :warn }.count
        end

        def warning_count
          @errors.select { |e| e[:severity] == :warn }.count
        end

        def empty?
          error_count.zero?
        end
      end
    end
  end
end
