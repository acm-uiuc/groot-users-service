FILE_PATH = "/scripts/data.csv"
puts "IMPORT LOCATION: #{FILE_PATH}"

CSV.foreach(Dir.pwd + FILE_PATH, headers: true) do |row|
  quote_text = Oga.parse_html(row['quote_text']).children.map(&:text).join
  quote_source = Oga.parse_html(row['quote_sources']).children.map(&:text).join
  quote_author = Oga.parse_html(row['quote_posters']).children.map(&:text).join

  next unless quote_text && quote_source
  next unless Quote.first(text: quote_text).nil?

  next unless quote_author && quote_source && !quote_author.empty? && !quote_source.empty?
  author = (quote_author.gsub(",", "").empty?) ? quote_source[1..2] : quote_author.gsub(",", "")
  
  Quote.create(
    text: quote_text,
    source: quote_source[1..-2],
    author: author,
    created_at: row['created_at'] ? DateTime.strptime(row['created_at'], '%m/%d/%y %k:%M') : DateTime.now,
    approved: true
  )
end
