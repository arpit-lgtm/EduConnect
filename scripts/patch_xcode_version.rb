#!/usr/bin/env ruby
# Patch React Native Xcode version requirement so builds can run on GitHub Actions Xcode 15.x

helpers_path = File.join('node_modules','react-native','scripts','cocoapods','helpers.rb')
utils_path   = File.join('node_modules','react-native','scripts','cocoapods','utils.rb')

def patch_file(path)
  unless File.exist?(path)
    puts "❌ Missing file: #{path}"
    return false
  end
  content = File.read(path)
  yield content
rescue => e
  puts "❌ Error patching #{path}: #{e.message}"
  false
end

patched = true

# 1. Downgrade min_xcode_version_supported
patched &&= patch_file(helpers_path) do |c|
  if c.include?('def self.min_xcode_version_supported')
    new_c = c.gsub(/def self\.min_xcode_version_supported.*?end/m, "def self.min_xcode_version_supported\n  '15.0'\nend")
    File.write(helpers_path, new_c)
    puts "✅ Patched helpers.rb min_xcode_version_supported -> 15.0"
  else
    puts "⚠️ helpers.rb: pattern not found"
  end
end

# 2. Replace Xcode version check method with no-op
patched &&= patch_file(utils_path) do |c|
  if c =~ /def self\.check_minimum_required_xcode.*?end/m
    new_c = c.gsub(/def self\.check_minimum_required_xcode.*?end/m, <<~RUBY)
def self.check_minimum_required_xcode(xcodebuild_manager: Xcodebuild)
  Pod::UI.puts 'Skipping XCode version check (patched)'
end
RUBY
    File.write(utils_path, new_c)
    puts "✅ Patched utils.rb check_minimum_required_xcode"
  else
    puts "⚠️ utils.rb: check method pattern not found"
  end
end

exit(patched ? 0 : 1)
