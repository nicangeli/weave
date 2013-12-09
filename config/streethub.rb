require 'open-uri'

json = open("https://www.streethub.com/api/public/products/?search=&category=womens")

puts json