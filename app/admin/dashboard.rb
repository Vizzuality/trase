ActiveAdmin.register_page "Dashboard" do
  menu priority: 1, label: proc { I18n.t("active_admin.dashboard") }

  content title: proc { I18n.t("active_admin.dashboard") } do
    columns do
      column do
        panel "Recent Posts" do
          ul do
            Content::Post.all.map do |post|
              li link_to(post.title, admin_post_path(post))
            end
          end
        end

        if controller.data_update_supported?
          panel "Last data update" do
            last_update = Api::V3::DatabaseUpdate.order(created_at: :desc).first

            div do
              if last_update.present?
                attributes_table_for last_update do
                  row :created_at
                  row :finished_at
                  row(:status) { |update| status_tag(update.status) }
                end
              else
                div "None"
              end
              div do
                link_to "Data updates", admin_database_update_path
              end
            end
          end

          panel "Last data validation" do
            last_validation = Api::V3::DatabaseValidationReport.
              order(created_at: :desc).first
            div do
              if last_validation.present?
                attributes_table_for last_validation do
                  row :created_at
                  row :finished_at
                  row(:status) { |validation| status_tag(validation.status) }
                end
              else
                div "None"
              end
              div do
                link_to "Data validations", admin_data_validation_path
              end
            end
          end
        end
      end
    end
  end
end
