using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using SShop.Domain.EF;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SShop.Domain.Helpers
{
    public class DbContextHelper
    {
        public static DbContextOptions<AppDbContext> GetDBContextOptions()
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();
            var connectionString = configuration.GetConnectionString("AppDbContext");
            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
            optionsBuilder.UseSqlServer(connectionString);

            return optionsBuilder.Options;
        }
    }
}