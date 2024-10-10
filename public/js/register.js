
/**
 * TODO: 8.4 Register new user
 *       - Handle registration form submission
 *       - Prevent registration when password and passwordConfirmation do not match
 *       - Use createNotification() function from utils.js to show user messages of
 *       - error conditions and successful registration
 *       - Reset the form back to empty after successful registration
 *       - Use postOrPutJSON() function from utils.js to send your data back to server
 */

 document.getElementById("register-form").addEventListener("submit", function(event) {
    event.preventDefault();

    let data = new FormData(event.target); 
    if (data.get('password') !== data.get('passwordConfirmation')) {
      createNotification("Passwords don't match", "notifications-container", false);
    } 
    else {
      data = Object.fromEntries(data); 
      postOrPutJSON('api/register', "POST", data)
      .then(() => { 
        createNotification("Register successful","notifications-container");
        document.getElementById("register-form").reset();
      }, err => {
        createNotification(err, "notifications-container", false);
      });
      }  
  });