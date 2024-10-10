# Group 

Member1:  Lauri Viitanen, lauri.viitanen@tuni.fi, K98617, 
resposible for:
|- Server Routes, Controller, Services, Models etc. (Level 1 of the assignment)

Member2:  name, email, student ID, 
resposible for: TODO, short description of duties 



# WebDev1 coursework assignment

A web shop with vanilla HTML, CSS. Only the first (+1) requirements are done.


### The project structure

```
Goal was to refactor project structure so that routes.js contains as little code and logic as possible. Because of that additional architecture layer 'Service' was added that is between routes and controller.

.
├── index.js                --> DONE
├── package.json            --> DONE
├── routes.js               --> Handles request and forwards it to the right service.
├── auth                    --> DONE
│   └──  auth.js            --> DONE
├── controllers             --> DONE
│   ├── orders.js           --> DONE - controller for orders. Calls Order Model
│   └── users.js            --> DONE - controller for user. Calls User Model
│   └── products.js         --> DONE - controller for products. Calls Product Model
├── models
|   |── db.js               --> DONE
|   |── product.js          --> DONE
|   |── user.js             --> DONE
|   └── order.js            --> DONE
├── public                  --> 
│   ├── img                 --> DONE
│   ├── js                  --> DONE
│   └── css                 --> DONE
├── Services                --> DONE
│   ├── orderService.js     --> DONE - Business logic and request parameter/payload check. Calls Order controller
│   └── userService.js      --> DONE - Business logic and request parameter/payload check. Calls User controller
│   └── productService.js   --> DONE - Business logic and request parameter/payload check. Calls Product controller
├── utils                   --> DONE
│   ├── render.js           --> DONE
│   ├── requestUtils.js     --> DONE
│   └── responseUtils.js    --> DONE
└── test
│   ├── auth                --> DONE
│   ├── controllers         --> DONE
└── └── own                 --> DONE


```
## The architecture 

TODO: describe the system, important buzzwords include MVC and REST.
UML diagrams would be highly appreciated.


## Tests and documentation

TODO: Links to at least 10 of your group's GitLab issues, and their associated Mocha tests and test files.

## Security concerns

TODO: list the security threats represented in the course slides.
Document how your application protects against the threats.
You are also free to add more security threats + protection here, if you will.

