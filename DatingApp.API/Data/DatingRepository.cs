using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    // inhereting the Repo Interface
    public class DatingRepository : IDatingRepository
    {
        private readonly DataContext _context;
        public DatingRepository(DataContext context)
        {
            _context = context;

        }

        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
             _context.Remove(entity);
        }

        public async Task<User> GetUser(int Id)
        {
            // using Include to include navigation properties eg pictures.
            var user = await _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(x =>x.Id == Id);
            return user;
        }

        public async Task<IEnumerable<User>> GetUsers()
        {
            // getting the user including his/her photo
            var users = await _context.Users.Include(p =>p.Photos).ToListAsync();
            return users;
        }

        public async Task<bool> SaveAll()
        {
            // returns true if its > 0
            return await _context.SaveChangesAsync() > 0;
        }

      
      
       public async Task<Photo> GetPhoto(int Id)
        {
            var photo = await _context.Photos.FirstOrDefaultAsync(p => p.Id == Id);
            return photo;
        }

        public async Task<Photo> GetMainUserPhoto(int UserId)
        {
           var mainPhoto =await _context.Photos.Where(u => u.UserId == UserId).FirstOrDefaultAsync( p => p.IsMain);
           return mainPhoto;
        }
    }
}