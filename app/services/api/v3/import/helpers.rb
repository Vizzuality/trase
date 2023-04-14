module Api
  module V3
    module Import
      module Helpers
        def self.included(base)
          base.extend(ClassMethods)
        end

        module ClassMethods
          # comma separated column names
          # format for INSERT
          def column_names_cs(options = {})
            columns = self.columns.map(&:name).map(&:to_sym)
            columns -= options[:except] if options[:except]&.any?
            if options[:prefix]
              columns = columns.map { |c| "#{options[:prefix]}.#{c}" }
            end
            columns.join(", ")
          end

          def blue_foreign_keys
            []
          end
        end
      end
    end
  end
end
