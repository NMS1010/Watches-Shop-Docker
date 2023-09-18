using System;

namespace SShop.Domain.Entities
{
    public class ReviewItem
    {
        public int ReviewItemId { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }
        public int Status { get; set; }
        public int Rating { get; set; }
        public string Content { get; set; }

        public OrderItem OrderItem { get; set; }
    }
}