require 'json-diff'
require 'csv-diff'
require 'zip'

namespace :gold_master do
  desc 'Record endpoint responses for gold master specs'
  task record: [:environment] do
    %w[csv json].each do |format|
      endpoints[format].each do |endpoint|
        next unless endpoint['v3_ready'] # eliminate those not ready to test
        endpoint['queries'].each do |query|
          gold_master_file = gold_master_file(endpoint, query, format)
          puts gold_master_url(endpoint, query)
          `curl -g "#{gold_master_url(endpoint, query)}" > #{gold_master_file}`
          unzip_and_replace_csv(gold_master_file) if format == 'csv'
        end
      end
    end
    zip_dir(gold_master_dir, gold_master_archive)
    cleanup
  end

  desc 'Run gold master tests'
  task test: [:extract_gold_master, :compare_json, :compare_csv]

  task extract_gold_master: [:environment] do
    unzip_archive(gold_master_archive, gold_master_dir)
  end

  task compare_csv: [:environment] do
    compare('csv') do |gold_master_file, actual_file|
      diff = CSVDiff.new(gold_master_file, actual_file)
    end
  end

  task compare_json: [:environment] do
    compare('json') do |gold_master_file, actual_file|
      gold_master = HashSorter.new(JSON.parse(File.read(gold_master_file))).sort
      actual = HashSorter.new(JSON.parse(File.read(actual_file))).sort
      diff = JsonDiff.diff(
        gold_master,
        actual
      )
    end
  end

  def compare(format)
    endpoints[format].each do |endpoint|
      next unless endpoint['v3_ready'] # eliminate those not ready to test
      endpoint['queries'].each do |query|
        gold_master_file = gold_master_file(endpoint, query, format)
        actual_file = actual_file(endpoint, query, format)
        puts actual_url(endpoint, query)
        `curl -g "#{actual_url(endpoint, query)}" > #{actual_file}`
        unzip_and_replace_csv(actual_file) if format == 'csv' # because downloads come as zip
        diff = yield(gold_master_file, actual_file)
        if diff.any?
          puts diff.inspect
          cleanup
          exit 1
        end
      end
    end
    cleanup
    exit 0
  end

  def endpoints
    YAML.load(File.open("#{Rails.root}/spec/support/gold_master_urls.yml"))
  end

  def host(version)
    case version
    when 'v1'
      ENV['GOLD_MASTER_HOST_V1']
    when 'v2'
      ENV['GOLD_MASTER_HOST_V2']
    else
      ENV['GOLD_MASTER_HOST_V3']
    end
  end

  def gold_master_url(endpoint, query)
    host(endpoint['version']) + endpoint['url'] + '?' + query['params']
  end

  def actual_url(endpoint, query)
    actual_url = endpoint['v3_url'] || endpoint['url']
    actual_params = query['v3_params'] || query['params']
    host('v3') + actual_url + '?' + actual_params
  end

  def gold_master_file(endpoint, query, format)
    file_with_format(gold_master_dir, format, endpoint, query)
  end

  def actual_file(endpoint, query, format)
    tmp_dir = "#{Rails.root}/tmp/actual"
    file_with_format(tmp_dir, format, endpoint, query)
  end

  def file_with_format(dir, format, endpoint, query)
    dir_with_format = "#{dir}/#{format}"
    FileUtils.mkdir_p(dir_with_format, verbose: true) unless File.directory?(dir_with_format)
    "#{dir_with_format}/#{endpoint['name']}_#{query['name']}.#{format}"
  end

  # take a .zip file saved as .csv, unzip, extract .csv
  # and save it at original path
  def unzip_and_replace_csv(file_path)
    dir = File.dirname(file_path)
    base = File.basename(file_path)
    tmp_file_path = File.join(dir, 'tmp_' + base)
    Zip::File.open(file_path) do |zipfile|
      entry = zipfile.glob('*.csv').first
      entry.extract(tmp_file_path)
    end
    FileUtils.mv(tmp_file_path, file_path)
  end

  def gold_master_dir
    "#{Rails.root}/spec/support/gold_master"
  end

  def gold_master_archive
    gold_master_dir + '.zip'
  end

  def zip_dir(src_dir, archive)
    FileUtils.rm archive, force: true

    Zip::File.open(archive, 'w') do |zipfile|
      Dir["#{src_dir}/**/**"].reject { |f| f == archive }.each do |file|
        zipfile.add(file.sub(src_dir + '/', ''), file)
      end
    end
  end

  def unzip_archive(archive, dest_dir)
    Zip::File.open(archive) do |zip_file|
      zip_file.each do |f|
        f_path = File.join(dest_dir, f.name)
        FileUtils.mkdir_p(File.dirname(f_path))
        zip_file.extract(f, f_path) unless File.exist?(f_path)
      end
    end
  end

  def cleanup
    FileUtils.rm_rf(gold_master_dir)
  end
end
