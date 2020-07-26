using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.API.Data;
using DatingApp.API.DTOs;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DatingApp.API.Controllers
{
    [Authorize]
    [Route("api/users/{userId}/photos")]
    [ApiController]
    public class PhotosController : ControllerBase
    {
        // using Ioptions to access the cloudinary service.
        private readonly IDatingRepository _repository;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        private readonly IMapper _mapper;
        private Cloudinary _cloudinary;

        public PhotosController(IDatingRepository repository, IOptions<CloudinarySettings> cloudinaryConfig, IMapper mapper)
        {
            _mapper = mapper;
            _cloudinaryConfig = cloudinaryConfig;
            _repository = repository;

            Account acc = new Account(
               _cloudinaryConfig.Value.CloudName,
               _cloudinaryConfig.Value.ApiKey,
               _cloudinaryConfig.Value.ApiSecret 
               // strings from AppSettings
            );
         

           _cloudinary = new Cloudinary(acc);
        }


        [HttpGet("{id}", Name = "GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photoFromRepo = await _repository.GetPhoto(id);
            var photo = _mapper.Map<PhotoForReturn>(photoFromRepo);
            return Ok(photo);
            
        }


        [HttpPost]
        // Photo Upload to cloudinary
        // FromForm to give a hint to where the rquest is coming from for dubugging purpose
        public async Task<IActionResult> AddPhotoUser(int Userid, 
        [FromForm] PhotoForCreation photoForCreation)

        {
             // compare passed id with the payload id of the user
            if(Userid != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            return Unauthorized();
            // get user from Repo
            var userFromRepo = await _repository.GetUser(Userid);
            // store the uploaded photo
            var file = photoForCreation.File;
            // store cloudinary results
            var uploadResult = new ImageUploadResult();
            // check if file is empty
           if(file.Length > 0)
           {
               // use using decorator to dispose of the method from memory after execution
               using(var stream = file.OpenReadStream())
               {
                 // passing our uploadParams to cloudinary  
                 var uploadParams = new ImageUploadParams()
                 {
                     File = new FileDescription(file.Name, stream),
                     Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
                   
                 };

                 uploadResult = _cloudinary.Upload(uploadParams);
               }
           }
           photoForCreation.Url = uploadResult.Url.ToString();
           photoForCreation.PublicId = uploadResult.PublicId;
           // map photoForCreation to Photo

           var photo = _mapper.Map<Photo>(photoForCreation);

           // set uploaded picture is the 1st one and set it to main
           if(!userFromRepo.Photos.Any(u => u.IsMain))
             photo.IsMain = true;

             userFromRepo.Photos.Add(photo);

             

             if(await _repository.SaveAll())
             {
                 var PhotoToReturn = _mapper.Map<PhotoForReturn>(photo);
                 return CreatedAtRoute("GetPhoto", new {Userid = Userid, id = photo.Id}, PhotoToReturn);
             }

             return BadRequest("Could not add Photo");
           
            
        }

        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> SetMainPhoto(int Userid, int id)
        {
            if(Userid != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            return Unauthorized();
            // get user from Repo
            var userFromRepo = await _repository.GetUser(Userid);
            // check if user is updating his/her photo
            if (!userFromRepo.Photos.Any(p => p.Id == id))
             return Unauthorized();
            // get photo

            var photoFromRepo = await _repository.GetPhoto(id);
            // check if the photo is already main photo

            if(photoFromRepo.IsMain)
            return BadRequest("This is already the Main photo");

            //get the current main Photo

            var CurrentMainPhoto = await _repository.GetMainUserPhoto(Userid);

           // set the value of current main photo to false
           CurrentMainPhoto.IsMain = false;

           photoFromRepo.IsMain = true;

           if(await _repository.SaveAll())
           return NoContent();

           return BadRequest("Could Not SetPhoto to Main");
             
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhoto(int Userid, int id)
        {
            if(Userid != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            return Unauthorized();
            // get user from Repo
            var userFromRepo = await _repository.GetUser(Userid);
            // check if user is updating his/her photo
            if (!userFromRepo.Photos.Any(p => p.Id == id))
             return Unauthorized();
            // get photo

            var photoFromRepo = await _repository.GetPhoto(id);
            // check if the photo is already main photo

            if(photoFromRepo.IsMain)
            return BadRequest("You Are Not allowed to Delete Your Main Photo");
            // deleting photo in cloudinary
            if (photoFromRepo.PublicID != null)
            {
            var deletionParams = new DeletionParams(photoFromRepo.PublicID);
            var result =  _cloudinary.Destroy(deletionParams);
            if (result.Result == "ok"){
                _repository.Delete(photoFromRepo);
            }
             
            }

            if(photoFromRepo.PublicID == null)
            {
                 _repository.Delete(photoFromRepo);
            }
              // deleting photo in database

            if (await _repository.SaveAll())
             return Ok();

             return BadRequest("Failed to delete Photo");
        }

    }
}