using System.Threading.Tasks;
using DatingApp.API.Data;
using Microsoft.AspNetCore.Mvc;
using DatingApp.API.Models;
using DatingApp.API.DTOs;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.Configuration;
using System;
using System.IdentityModel.Tokens.Jwt;
using AutoMapper;

namespace DatingApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;
        public AuthController(IAuthRepository repo, IConfiguration config, IMapper mapper)
        {
         _mapper = mapper;
            _config = config;
            _repo = repo;

        }

        [HttpPost("register")]

        //User Registeration
        public async Task<IActionResult> Register(UserForRegister userForRegister)
        {

            userForRegister.Username = userForRegister.Username.ToLower();
            if (await _repo.UserExists(userForRegister.Username))
                return BadRequest("Username Already Exists");

            //create user

            var userToCreate = _mapper.Map<User>(userForRegister);
            

            var createdUser = await _repo.Register(userToCreate, userForRegister.Password);
                                        //<destination>(source)
            var UserToReturn = _mapper.Map<UserForDetailed>(createdUser);
            // created UserToReturn because we donot want to return createdUser that contains passwords.
            return CreatedAtRoute("GetUser", new{Controller = "Users", id = createdUser.Id}, UserToReturn);
        }

        //User Login

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLogin userForLogin)
        {

            // getting the user from the db through repo
            var userFromRepo = await _repo.Login(userForLogin.Username, userForLogin.Password);

            if (userFromRepo == null) return Unauthorized();
            // creating token claims: passing the payload information
            var claims = new[]
            {
              new Claim(ClaimTypes.NameIdentifier, userFromRepo.Id.ToString()),
              new Claim(ClaimTypes.Name, userFromRepo.Username)

           };
            //creating token key: getting token from appsettings

            var key = new SymmetricSecurityKey(Encoding.UTF8
            .GetBytes(_config.GetSection("AppSettings:Token").Value));

            //hashing token key   
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

            // passing token header, payload and secret to Tokendiscriptor
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };

            // creating token

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            var user = _mapper.Map<UserForLists>(userFromRepo);

            return Ok(new
            {
                token = tokenHandler.WriteToken(token),
                user
            });




        }
    }
}