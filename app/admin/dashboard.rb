ActiveAdmin.register_page 'Dashboard' do
  menu priority: 1, label: proc { I18n.t('active_admin.dashboard') }

  content title: proc { I18n.t('active_admin.dashboard') } do
    columns do
      column do
        panel 'Recent Posts' do
          ul do
            Content::Post.all.map do |post|
              li link_to(post.title, admin_post_path(post))
            end
          end
        end
      end
    end
  end
end
