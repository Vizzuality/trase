namespace :db do
  namespace :content do
    desc 'Copy data from content db into content schema'
    task copy: [:environment] do
      SchemaContent.new.copy
    end

    desc 'Copy markdown static content into pages table'
    task copy_static_content: [:environment] do
      Dir[
        Rails.root.join('frontend/public/static-content/about/*.md')
      ].each do |fname|
        basename = File.basename(fname, '.md')
        content = File.read(fname)
        page = Content::Page.find_by_name(basename) ||
          Content::Page.new(name: basename)
        page.content = content
        page.save
      end
    end
  end
end
