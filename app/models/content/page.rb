# == Schema Information
#
# Table name: content.pages
#
#  id      :bigint(8)        not null, primary key
#  name    :text             not null
#  content :text             not null
#
module Content
  class Page < Content::Base
    validates :name, presence: true, uniqueness: true
    validates :content, presence: true

    before_validation :parameterize_name

    def parameterize_name
      self.name = name.parameterize
    end
  end
end
