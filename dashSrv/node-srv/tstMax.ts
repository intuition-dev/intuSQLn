
const perfy = require('perfy')

const Reader = require('@maxmind/geoip2-node').Reader;


Reader.open('GeoLite2-City.mmdb').then(reader => {
   perfy.start('g')

  const response = reader.city('128.101.101.101')
 
  console.log(response.country.isoCode) // 'US'
  let time = perfy.end('g')
  console.log(time)
})
