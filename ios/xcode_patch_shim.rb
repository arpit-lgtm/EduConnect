# This file is loaded before react_native_pods.rb to modify the Xcode version check
# and ensure compatibility with GitHub Actions runners

# Override ReactNativePodsUtils module before it's defined
module ReactNativePodsUtils
  class << self
    alias_method :original_check_minimum_required_xcode, :check_minimum_required_xcode if defined? :check_minimum_required_xcode
    
    def check_minimum_required_xcode(xcodebuild_manager = nil)
      puts "Xcode version check bypassed by patch shim"
    end
  end
end

# Override Helpers module before it's defined
module Helpers
  class Constants
    class << self
      alias_method :original_min_xcode_version_supported, :min_xcode_version_supported if defined? :min_xcode_version_supported
      
      def min_xcode_version_supported
        '15.0'
      end
    end
  end
end