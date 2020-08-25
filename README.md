# DevConnect
#https://ancient-refuge-42213.herokuapp.com
This is project I made thorugh my course for MERN Stack learing from Brad Traversy MERN Stack

Put Your mongo URI and other things on production JS.


Overview - It is full stack project which developers can visit other developers profile and create their own. So, providing a platform where differecnt developers can connect.User need to login to add his/her own details and can add skills , social links , education , experience etc.
User can also edit their own profile and delete accound option is also available.
Stack - Mongo DB , Express JS , Node JS , React 
Others: Bcrypt.js , express-validator , react-redux , json web token , npm (node package manager).

Backend Implementation:So in backend of project there are four main themed routes.
1.Profile Routes
2.Auth Routes ( for login and sign up)
3.User Routes 

Profile routes contains rotes for showing profiles of all the devs , individual profile , editing profile and making profile .

User routes is for registering user
Express validator is checked whehter name , email and passwords have been correctly entered or not
If there are no validation errors , then

Auth routes contain verifying user through token and authentication user ( by generating token).

All the authentication is done thorugh json web token and password protecting is done through bcrypt.



So , This project has all 4 routes
1.Get route
2.Post Route
3.Put Route
4.Delete Route



Front End Implementation: In front end , react framework and css is used.
Redux is used for storing the state. 
Redux is state container for react apps and project make use of redux store for importing/exporting content




