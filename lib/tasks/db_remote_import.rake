namespace :db do
  namespace :remote do
    task import: :environment do
      Api::V3::Import::Importer.new.call
    end
  end
end
