using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using TtSWebsocket.Hubs;
using System.Text;
using Microsoft.CognitiveServices.Speech;
using Microsoft.CognitiveServices.Speech.Audio;
using System.Text.Json;
using TtSWebsocket.Models;

namespace TtSWebsocket.Controllers
{
    public class BackendController : Controller
    {
        private readonly IHubContext<SignalRTtS> _hubContext;
        private readonly SpeechConfig _speechConfig;

        public BackendController(IHubContext<SignalRTtS> hubContext)
        {
            _hubContext = hubContext;
            _speechConfig = SpeechConfig.FromSubscription("9c1adec6de47477db9074133e4005c63", "southeastasia");
        }

        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> Index(string msg)
        {
            var audioArray = await SynthesizeAudioAsync(msg);
            var to_base64_string = Convert.ToBase64String(audioArray, 0, audioArray.Length,
                                Base64FormattingOptions.None);
            await _hubContext.Clients.All.SendAsync("ReceiveMessage", "Backend", JsonSerializer.Serialize(
                new Message
                {
                    Msg = msg,
                    AudioStream = to_base64_string
                }
            ));
            return View();
        }

        async Task<byte[]> SynthesizeAudioAsync(string msg)
        {
            var response = new byte[] { };
            var autoDetecConfig = AutoDetectSourceLanguageConfig.FromOpenRange();
            using var synthesizer = new SpeechSynthesizer(_speechConfig,autoDetecConfig,AudioConfig.FromDefaultSpeakerOutput());
            using var result = await synthesizer.SpeakTextAsync(msg);
            if (result.Reason == ResultReason.SynthesizingAudioCompleted)
            {
                response = result.AudioData;
            }
            return response;
        }


    }
}
