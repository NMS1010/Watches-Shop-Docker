using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SShop.Utilities.Interfaces
{
    public interface IGenericRepository<T> where T : class
    {
        Task<IEnumerable<T>> GetAll();

        Task<T> GetById(object id);

        Task Insert(T entity);

        void Update(T entity);

        void Delete(T entity);
    }
}