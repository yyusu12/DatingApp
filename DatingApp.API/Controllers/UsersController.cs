
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IDatingRepository _repository;
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public UsersController(IDatingRepository repository, DataContext context, IMapper mapper)
        {
           _mapper = mapper;
            _context = context;
            _repository = repository;

        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _repository.GetUsers();
            var usersToReturn = _mapper.Map<IEnumerable<UserForLists>>(users);
            return Ok(usersToReturn);

        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _repository.GetUser(id);
            var userToReturn =  _mapper.Map<UserForDetailed>(user);
            return Ok(userToReturn);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserForUpdate userForUpdate)
        {
            // compare passed id with the payload id of the user
            if(id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            return Unauthorized();
            // get user from Repo
            var userFromRepo = await _repository.GetUser(id);
            // update user using AutoMapper.
            _mapper.Map(userForUpdate, userFromRepo);
            // check if the update is successful
            if(await _repository.SaveAll())
            return NoContent();
            // if fails, throw exception
            throw new Exception($"updating user {id} failed on save");
           
        }

    }
}