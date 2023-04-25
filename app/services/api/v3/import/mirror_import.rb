module Api
  module V3
    module Import
      class MirrorImport
        def call(database_update, s3_filename)
          timer_stats = {}
          schema_importer = Api::V3::DatabaseImport::SchemaImporter.new(s3_filename)
          timer_stats["copy"] = Timer.with_timer do
            schema_importer.call
          end
          timer_stats["import"] = Timer.with_timer do
            Api::V3::Import::Importer.new(
              database_update, ENV["TRASE_LOCAL_MIRROR_SCHEMA"]
            ).call { schema_importer.cleanup }
          end
          stats = database_update.reload.stats
          stats["elapsed_seconds"] = timer_stats
          database_update.update_stats(stats)
        end
      end
    end
  end
end
