module Api
  module V3
    class BaseModel < ActiveRecord::Base
      include Api::V3::Import::Helpers
      self.abstract_class = true

      establish_connection DB_REVAMP

      private

      def self.all_column_comments
        unless defined?(@@all_comments)
          data = YAML.safe_load(
            File.open("#{Rails.root}/db/schema_comments.yml")
          )
          @@all_comments = data && data['tables']
        end
        @@all_comments
      end

      def self.column_comments
        unless @comments
          tmp = all_column_comments.find do |cc|
            cc['name'] == table_name
          end
          @comments = tmp && tmp['columns']
        end
        @comments
      end

      def self.column_comment(column_name)
        tmp = column_comments.find do |cc|
          cc['name'] == column_name
        end
        tmp && tmp['comment']
      end
    end
  end
end
