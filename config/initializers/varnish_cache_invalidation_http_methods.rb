require 'net/http'

module Net
  class HTTP::Purge < HTTPRequest
    METHOD='PURGE'
    REQUEST_HAS_BODY = false
    RESPONSE_HAS_BODY = true
  end

  class HTTP::Ban < HTTPRequest
    METHOD='BAN'
    REQUEST_HAS_BODY = false
    RESPONSE_HAS_BODY = true
  end
end
