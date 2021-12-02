# == Schema Information
#
# Table name: methods_and_data_docs
#
#  id         :bigint(8)        not null, primary key
#  context_id :bigint(8)        not null
#  version    :text             not null
#  language   :text             not null
#  url        :text             not null
#
# Indexes
#
#  index_methods_and_data_docs_on_context_id  (context_id)
#
# Foreign Keys
#
#  fk_rails_...  (context_id => contexts.id) ON DELETE => cascade
#
module Api
  module V3
    class MethodsAndDataDoc < YellowTable
      include UrlFixer

      belongs_to :context

      validates :context, presence: true, uniqueness: {scope: :language}
      validates :version, presence: true
      validates :language, presence: true
      validates :url, presence: true, format: {with: URI::DEFAULT_PARSER.make_regexp(['http', 'https'])}

      before_validation { fixup }

      def fixup
        format_url :url
      end

      def self.blue_foreign_keys
        [
          {name: :context_id, table_class: Api::V3::Context}
        ]
      end
    end
  end
end
