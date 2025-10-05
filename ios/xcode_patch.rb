#!/usr/bin/env ruby
# Simple script to patch React Native to bypass Xcode version check

def patch_xcode_version_check
  # Path to react_native_pods.rb
  react_native_pods_path = File.join('..', 'node_modules', 'react-native', 'scripts', 'react_native_pods.rb')
  helpers_path = File.join('..', 'node_modules', 'react-native', 'scripts', 'cocoapods', 'helpers.rb')
  utils_path = File.join('..', 'node_modules', 'react-native', 'scripts', 'cocoapods', 'utils.rb')
  
  # Patch helpers.rb to change min Xcode version
  if File.exist?(helpers_path)
    helpers_content = File.read(helpers_path)
    if helpers_content.include?('def self.min_xcode_version_supported')
      helpers_content.gsub!(/def self\.min_xcode_version_supported.*?end/m, 
                           "def self.min_xcode_version_supported\n            return '15.0'\n        end")
      File.write(helpers_path, helpers_content)
      puts "✅ Successfully patched helpers.rb min_xcode_version_supported"
    else
      puts "❌ Could not find min_xcode_version_supported in helpers.rb"
    end
  else
    puts "❌ Could not find helpers.rb at #{helpers_path}"
  end
  
  # Patch utils.rb to bypass version check
  if File.exist?(utils_path)
    utils_content = File.read(utils_path)
    check_method_regex = /def self\.check_minimum_required_xcode.*?end/m
    
    if utils_content =~ check_method_regex
      new_method = <<-RUBY
    def self.check_minimum_required_xcode(xcodebuild_manager: Xcodebuild)
        # Always bypass check
        Pod::UI.puts "Skipping XCode version check due to patching"
    end
      RUBY
      
      utils_content.gsub!(check_method_regex, new_method)
      File.write(utils_path, utils_content)
      puts "✅ Successfully patched utils.rb check_minimum_required_xcode"
    else
      puts "❌ Could not find check_minimum_required_xcode in utils.rb"
    end
  else
    puts "❌ Could not find utils.rb at #{utils_path}"
  end
end

# Run the patch
patch_xcode_version_check