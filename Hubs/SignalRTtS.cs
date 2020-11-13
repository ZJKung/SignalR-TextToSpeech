using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using TtSWebsocket.Models;
using System.Text.Json;
namespace TtSWebsocket.Hubs
{
    public class SignalRTtS:Hub
    {
        public async Task SendMessage(string user,string message)
        {
            await Clients.All.SendAsync("ReceiveMessage",user,JsonSerializer.Serialize(new Message{
                Msg = message,
                AudioStream = ""
            }));
        }
    }
}
