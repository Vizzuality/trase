ActiveAdmin.register_page "Data Validation" do
  menu parent: "Database", if: proc { controller.data_update_supported? }

  controller do
    before_action :ensure_data_update_supported
  end

  content do
    database_validations = Api::V3::DatabaseValidationReport.
      order(created_at: :desc).
      limit(25)
    tabs do
      tab :reports do
        render partial: "admin/database_validation/form", locals: {
          database_validations: database_validations
        }
      end
      tab :rules do
        table_for Api::V3::DatabaseValidation::Report.human_readable_rules, class: "index_table" do
          column("Validated object") { |rule| rule[:validated_object] }
          column("Rule") { |rule| rule[:rule] }
        end
      end
    end
  end

  page_action :start, method: :post do
    @report = Api::V3::DatabaseValidation::Report.new
    @report.call
    redirect_to admin_data_validation_url,
                notice: "Database validation completed."
  end

  page_action :report, method: :get do
    @database_validation = Api::V3::DatabaseValidationReport.find(params[:id])
    filename = "report-#{@database_validation.finished_at}.json"
    send_data JSON.pretty_generate(@database_validation.report),
              disposition: "attachment; filename=#{filename}"
  end
end
