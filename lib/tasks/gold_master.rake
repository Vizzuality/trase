require "zipfile"

namespace :gold_master do
  desc "Record endpoint responses for gold master specs"
  task record: [:environment] do
    %w[csv json].each do |format|
      endpoints[format].each do |endpoint|
        endpoint["queries"].each do |query|
          downloaded_gold_master_file = gold_master_file(endpoint, query, format, endpoint["compressed"])
          gold_master_file = gold_master_file(endpoint, query, format)
          puts gold_master_url(endpoint, query)
          `curl -g "#{gold_master_url(endpoint, query)}" > #{downloaded_gold_master_file}`
          if endpoint["compressed"]
            Zipfile.extract_data_file_to_path(downloaded_gold_master_file, gold_master_file, format)
          end
        end
      end
    end
    Zipfile.zip_dir(gold_master_dir, gold_master_archive)
    cleanup_gold_master
  end

  desc "Run gold master tests"
  task test: [:extract_gold_master, :cleanup_actual, :compare_csv, :compare_json, :cleanup_gold_master]

  task extract_gold_master: [:environment] do
    Zipfile.unzip_archive(gold_master_archive, gold_master_dir)
  end

  task compare_csv: [:environment] do
    compare("csv", true) do |gold_master_file, actual_file|
      gold_master_file_sorted = actual_file + ".gold_master.sorted"
      `sort #{gold_master_file} > #{gold_master_file_sorted}`
      actual_file_sorted = actual_file + ".sorted"
      `sort #{actual_file} > #{actual_file_sorted}`
      "diff #{gold_master_file_sorted} #{actual_file_sorted} > #{actual_file}.diff"
    end
  end

  task compare_json: [:environment] do
    compare("json") do |gold_master_file, actual_file|
      gold_master = HashSorter.new(JSON.parse(File.read(gold_master_file))).sort
      actual = HashSorter.new(JSON.parse(File.read(actual_file))).sort
      # stores sorted versions for inspection
      gold_master_file_sorted = actual_file + ".gold_master.sorted"
      File.open(gold_master_file_sorted, "w") do |f|
        f << JSON.pretty_generate(gold_master, indent: "  ")
      end
      actual_file_sorted = actual_file + ".sorted"
      File.open(actual_file_sorted, "w") do |f|
        f << JSON.pretty_generate(actual, indent: "  ")
      end
      "diff #{gold_master_file_sorted} #{actual_file_sorted} > #{actual_file}.diff"
    end
  end

  task cleanup_actual: [:environment] do
    FileUtils.rm_rf(actual_dir)
  end

  task cleanup_gold_master: [:environment] do
    cleanup_gold_master
  end

  def compare(format, compressed = false)
    endpoints[format].each do |endpoint|
      endpoint["queries"].each do |query|
        gold_master_file = gold_master_file(endpoint, query, format)
        puts gold_master_file
        downloaded_file = actual_file(endpoint, query, format, compressed)
        actual_file = actual_file(endpoint, query, format)
        puts actual_url(endpoint, query)
        `curl -g "#{actual_url(endpoint, query)}" > #{downloaded_file}`
        if endpoint["compressed"]
          Zipfile.extract_data_file_to_path(downloaded_file, actual_file, format)
        end
        diff_cmd = yield(gold_master_file, actual_file)
        puts diff_cmd
        `#{diff_cmd}`
        diff_file = "#{actual_file}.diff"
        if File.size(diff_file).positive?
          puts "DIFFERENCES DETECTED, PLEASE INSPECT #{diff_file}"
        else
          puts "SUCCESS"
        end
      end
    end
  end

  def endpoints
    # make sure this follows aliases
    YAML.safe_load(File.open("#{Rails.root}/spec/support/gold_master_urls.yml"), [], [], true)
  end

  def gold_master_host
    ENV["GOLD_MASTER_HOST_V3"]
  end

  def actual_host
    ENV["GOLD_MASTER_HOST_V3"]
  end

  def gold_master_url(endpoint, query)
    gold_master_host + endpoint["url"] + "?" + (query["params"] || "")
  end

  def actual_url(endpoint, query)
    actual_host + endpoint["url"] + "?" + (query["params"] || "")
  end

  def gold_master_file(endpoint, query, format, compressed = false)
    file_with_format(gold_master_dir, compressed ? "zip" : format, endpoint, query)
  end

  def actual_file(endpoint, query, format, compressed = false)
    file_with_format(actual_dir, compressed ? "zip" : format, endpoint, query)
  end

  def file_with_format(dir, format, endpoint, query)
    dir_with_format = "#{dir}/#{format}"
    FileUtils.mkdir_p(dir_with_format, verbose: true) unless File.directory?(dir_with_format)
    "#{dir_with_format}/#{endpoint["name"]}_#{query["name"]}.#{format}"
  end

  def actual_dir
    "#{Rails.root}/tmp/actual"
  end

  def gold_master_dir
    "#{Rails.root}/spec/support/gold_master"
  end

  def gold_master_archive
    gold_master_dir + ".zip"
  end

  def cleanup_gold_master
    FileUtils.rm_rf(gold_master_dir)
  end
end
