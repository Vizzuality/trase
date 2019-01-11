module Api
  module V3
    module Import
      class RemoteImport
        def call(database_update)
          timer_stats = {}
          timer_stats['import'] = Timer.with_timer do
            Api::V3::Import::Importer.new(
              database_update, ENV['TRASE_LOCAL_FDW_SCHEMA']
            ).call
          end
          stats = database_update.reload.stats
          stats['elapsed_seconds'] = timer_stats
          database_update.update_stats(stats)
        end
      end
    end
  end
end
