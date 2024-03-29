﻿using System.Threading.Tasks;

namespace SShop.Services.External.MailJet
{
    public interface IMailJetServices
    {
        Task<bool> SendMail(string name, string email, string content, string title);
    }
}