using Microsoft.EntityFrameworkCore;
using SShop.Domain.EF;
using SShop.Domain.Helpers;
using SShop.Utilities.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SShop.Repositories.Common
{
    public class GenericRepository<T> : IGenericRepository<T>, IDisposable where T : class
    {
        private DbSet<T> _entities;
        private string _errorMessage = string.Empty;
        private bool _isDisposed;
        public AppDbContext Context { get; set; }

        protected virtual DbSet<T> Entities
        {
            get { return _entities ??= Context.Set<T>(); }
        }

        public GenericRepository(AppDbContext dbContext)
        {
            Context = dbContext;
            _isDisposed = false;
            _entities = dbContext.Set<T>();
        }

        public virtual void Delete(T entity)
        {
            if (entity == null)
            {
                throw new KeyNotFoundException("Cannot find this entity");
            }
            try
            {
                if (Context == null || _isDisposed)
                {
                    Context = new AppDbContext(DbContextHelper.GetDBContextOptions());
                }
                Entities.Remove(entity);
            }
            catch
            {
                throw new Exception("Cannot delete this entity");
            }
        }

        public void Dispose()
        {
            Context?.Dispose();
            GC.SuppressFinalize(this);
            _isDisposed = true;
        }

        public virtual async Task<IEnumerable<T>> GetAll()
        {
            return await Entities.ToListAsync();
        }

        public virtual async Task<T> GetById(object id)
        {
            return await Entities.FindAsync(id) ?? throw new KeyNotFoundException("Cannot find this entity");
        }

        public virtual async Task Insert(T entity)
        {
            if (entity == null)
            {
                throw new KeyNotFoundException("Cannot find this entity");
            }
            try
            {
                if (Context == null || _isDisposed)
                {
                    Context = new AppDbContext(DbContextHelper.GetDBContextOptions());
                }
                await Entities.AddAsync(entity);
            }
            catch
            {
                throw new Exception("Cannot insert this entity");
            }
        }

        public virtual void Update(T entity)
        {
            if (entity == null)
            {
                throw new KeyNotFoundException("Cannot find this entity");
            }
            try
            {
                if (Context == null || _isDisposed)
                {
                    Context = new AppDbContext(DbContextHelper.GetDBContextOptions());
                }
                Context.Entry(entity).State = EntityState.Modified;
            }
            catch
            {
                throw new Exception("Cannot update this entity");
            }
        }
    }
}