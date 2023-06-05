require "csv"

namespace :benchmarks do
  # API_ENV=[production|staging]
  task run: :environment do
    exit "API_ENV missing" unless ENV["API_ENV"].present? && ["production", "sandbox"].include?(ENV["API_ENV"])

    api_host =
      if ENV["API_ENV"] == "production"
        "https://supplychains.trase.earth"
      else
        "https://sandbox.trase.earth"
      end

    puts "Running tests on #{api_host}"
    test_urls = {
      flows: {
        no_recolor: "/api/v3/contexts/5/flows?start_year=2020&end_year=2020&include_columns=20%2C31%2C2%2C21&cont_attribute_id=1209&n_nodes=10",
        recolor_by_zdc: "/api/v3/contexts/5/flows?start_year=2020&end_year=2020&include_columns=20%2C31%2C2%2C21&cont_attribute_id=1209&n_nodes=10&ncont_attribute_id=251"
      }
    }

    test_results = {}
    sample_size = 5
    sample_size.times do |i|
      test_urls.each do |category, subcategory_paths|
        subcategory_paths.each do |subcategory, path|
          label = [category, subcategory].join("-")
          url = api_host + path
          response_size = nil
          pp label
          begin
            m = Benchmark.measure(label) { response_size = make_request(url + "&skip_cache=#{i}") }
          rescue Net::ReadTimeout
            puts "Timeout"
            next
          end
          pp response_size
          test_results[label] ||= {}
          test_results[label][:url] = url
          test_results[label][:results] ||= []
          test_results[label][:results] << m
        end
      end
    end
    output_filename = "tmp/#{ENV["API_ENV"]}_api_performance_measurements_#{Time.now}.csv"
    CSV.open(output_filename, "w") do |output_csv|
      output_csv << ["label", "URL", "user", "system", "total", "real"]
      test_results.each do |label, data|
        # data[:results].each do |m|
        #   output_csv << [label, data[:url], m.utime, m.stime, m.total, m.real]
        # end
        output_csv << [
          label + " AVG",
          data[:url],
          data[:results].map(&:utime).sum / sample_size,
          data[:results].map(&:stime).sum / sample_size,
          data[:results].map(&:total).sum / sample_size,
          data[:results].map(&:real).sum / sample_size
        ]
      end
    end
    pp output_filename
  end

  def make_request(url)
    resp = Net::HTTP.get_response(URI(url))
    resp.body.size
  end
end
