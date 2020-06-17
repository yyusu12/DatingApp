using System.Collections.Generic;
using System.Linq;
using DatingApp.API.Models;
using Newtonsoft.Json;

namespace DatingApp.API.Data
{
    public class Seed
    {
        // Add method inside program class
        public static void SeedUsers(DataContext dataContext)
        {
            // check if there are users in our database
            if(!dataContext.Users.Any())
            {
                // reading the user data from our json file
                var UserData = System.IO.File.ReadAllText("Data/UserSeedData.json");
                // using JsonConvert to desearilize the json objects'
                var users = JsonConvert.DeserializeObject <List<User>>(UserData);

                foreach(User user in users)
                {
                  byte[] passwordHash, passwordSalt;
                  CreatePasswordHash("password", out passwordHash, out passwordSalt);
                  user.PasswordHash = passwordHash;
                  user.PasswordSalt = passwordSalt;
                  user.Username = user.Username.ToLower();
                  dataContext.Users.Add(user);
                }

                dataContext.SaveChanges();
            
            }

        }

       private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {

            using(var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));  
            }
           
        }
    }
}