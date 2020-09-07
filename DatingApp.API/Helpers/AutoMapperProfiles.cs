using System.Linq;
using AutoMapper;
using DatingApp.API.DTOs;
using DatingApp.API.Models;

namespace DatingApp.API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserForLists>().
            ForMember(dest => dest.PhotoUrl, opt => opt.
            MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url)).ForMember(dest => dest.Age
            , opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge())); // mapping the userPhoto 
            
            CreateMap<User, UserForDetailed>().
             ForMember(dest => dest.PhotoUrl, opt => opt.
            MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url)).
            ForMember(dest => dest.Age
            , opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()));
            
            CreateMap<Photo,PhotosForDetailed>();
            CreateMap<UserForUpdate, User>();
            CreateMap<Photo, PhotoForReturn>();
            CreateMap<PhotoForCreation, Photo>();
            CreateMap<UserForRegister, User>();
        }
    }
}