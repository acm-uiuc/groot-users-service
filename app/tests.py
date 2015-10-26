#Test signup and signin
from api.controllers.user_controller import signup
from api.controllers.user_controller import signin

a = signup("Test","Tester", "tests4dayz", "tester@test.test", "testpw")
if a is None:
   print "signup success"
b = signin("tests4dayz", "testpw")
if b is "success":
   print "signin success"
