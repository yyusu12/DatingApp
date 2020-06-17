using System.Collections.Generic;
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
            var users = await _context.Users.Include(p =>p.Photos).ToListAsync();
            return users;
        }

        public async Task<bool> SaveAll()
        {
            // returns true if its > 0
            return await _context.SaveChangesAsync() > 0;
        }
    }
}