FILE_PATH = "/scripts/active_users.csv"
puts "IMPORT LOCATION: #{FILE_PATH}"

CSV.foreach(Dir.pwd + FILE_PATH, headers: true) do |row|
  params = {
    first_name: row['first_name'],
    last_name: row['last_name'],
    netid: row['netid'],
    is_member: true,
    added_to_directory: true
  }

  params[:uin] = Integer(row['uin']) unless row['uin'] == "NULL"

  User.create(params)
end
