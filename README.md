# Taking Note Webpage

# User Story

- This is a note based website application which will give people to sign up and be able to creat notes and save them to check them whenever they want.

# Technologies Used

1. HTML5
2. CSS
3. Java Script
4. Node and it's packages
5. Mongoose/MongoDB
6. Express

# Layout

1. Home Page
![diagram1](images.firstpage.png)

2. Signup/Login Page

![diagram2](images/secondpage.png)

3. Notes Page

![diagram3](images/thirdpage.png)

#### NOTES

| **URL**          | **HTTP Verb**|**Action**|
|------------------|--------------|----------|
| /food/         | GET          | index  
| /food/:id      | GET          | show       
| /food/new      | GET          | new   
| /food          | POST         | create   
| /food/:id/edit | GET          | edit       
| /food/:id      | PATCH/PUT    | update    
| /food/:id      | DELETE       | destroy  

#### Adding notes

| **URL**          | **HTTP Verb**|**Action**|
|--------------------|--------------|----------|
| /comments/:foodId | POST         | create  
| /comments/delete/:foodId/:commentId      | DELETE          | destroy       


#### Users

| **URL**          | **HTTP Verb**|**Action**|
|------------------|--------------|----------|
| /users/signup    | GET         | new  
| /users/signup    | POST         | create  
| /users/login     | GET         | login       
| /users/login     | POST         | create       
| /users/logout    | DELETE       | destroy   
