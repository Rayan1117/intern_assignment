Routes Overview

1. Login Routes

  i) POST /r0/login/r0
  This route handles user login. It requires the email and password in the request body. On successful login, a JWT token is returned for authentication.

2. Register Routes

  i) POST /r0/register/r0
  This route is used for new user registration. It accepts email, password, name, age, and role in the request body. Upon successful registration, a success message is returned.

3. Role-Based Access Routes

  i) /r0/role
  This route is protected and requires a valid JWT token. It checks whether the user has a valid token to access further routes.
  Admin Routes (For Admin Users Only) 

  ii) /r0/role/admin
  This route is accessible only to users with the admin role. It checks for the user role and ensures the user has the necessary permissions to access the admin functionality.
  User Routes (For Registered Users)

  iii) /r0/role/user
  This route is for users who are logged in as either user or admin. It checks the role and ensures only valid users can access it.

4. Admin Routes

  i) GET /r0/admin/get_users
  Retrieves the list of all registered users.

  ii) POST /r0/admin/add_event
  Allows the admin to add new events. The request body should contain details like event_name, description, event_date, location, etc.

  iii) PUT /r0/admin/update_event
  This route allows the admin to update event details based on the event_id passed as a query parameter.

  iv) DELETE /r0/admin/delete_event
  Deletes an event based on the event_id provided in the query.

  5. User Routes

  i) GET /r0/user/get_all_events
  This route fetches all events and returns them in the response.

  ii) GET /r0/user/get_event
  Fetches a specific event's details based on the event_id passed as a query parameter.
