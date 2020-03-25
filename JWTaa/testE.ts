
import { Email } from './bl/Email'


const e = new Email()


var to_name = 'Vic'
,to_email = 'uptimevic@gmail.com'
,from_name = 'Al'
,from_email = 'al@gore.com'
,subject = 'oh hi'
,body = '<p>Now this</p>'



e.send(
  'gmail',  'tone', 'user_4aWUwDyNvJDTKwiCEtCgz',
  to_name
  ,to_email
  ,from_name
  ,from_email
  ,subject
  ,body

)

