module Api
  module V3
    class BaseModel < ApplicationRecord
      include Api::V3::Import::Helpers
      self.abstract_class = true

      class << self
        def column_comment(column_name)
          tmp = column_comments.find do |cc|
            cc["name"] == column_name
          end
          tmp && tmp["comment"]
        end

        private

        def all_column_comments
          unless defined?(@@all_comments)
            data = load_from_file
            @@all_comments = data && data["tables"]
          end
          @@all_comments
        end

        def column_comments
          unless @comments
            tmp = all_column_comments.find do |cc|
              cc["name"] == table_name
            end
            @comments = tmp && tmp["columns"]
          end
          @comments
        end

        def load_from_file
          YAML.safe_load(
            File.open("#{Rails.root}/db/schema_comments.yml")
          )
        end
      end
    end
  end
end
