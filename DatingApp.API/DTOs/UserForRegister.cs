using System.ComponentModel.DataAnnotations;

namespace DatingApp.API.DTOs
{
    public class UserForRegister
    {
        [Required]
        public string Username { get; set; }

        [Required]
        [StringLength(8, MinimumLength = 4,ErrorMessage = "You must specify 8 or 4 characters" )]
        public string Password { get; set; }
    }
}