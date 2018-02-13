namespace :db do
  namespace :content do
    desc 'Copy data from content db into content schema'
    task copy: [:environment] do
      SchemaContent.new.copy
    end
  end
end
