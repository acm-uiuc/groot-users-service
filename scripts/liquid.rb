FILE_PATH = "/scripts/users.csv"
puts "IMPORT LOCATION: #{FILE_PATH}"

CSV.foreach(Dir.pwd + FILE_PATH, headers: true) do |row|
end
