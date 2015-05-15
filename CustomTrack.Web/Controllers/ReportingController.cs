using BriefBox.App.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace BriefBox.App.Controllers
{
    public class ReportingController : ApiController
    {
        [HttpPost]
        public void Record(string data)
        {
            double x;
            if (double.TryParse(data, out x))
            {
                x = x * 100;
                SignalRDevLogger.Instance.SendToClient(x);
            }

        }

        [HttpGet]
        public void Boom(string data)
        {
            double x;
            if (double.TryParse(data, out x))
            {
                x = x * 100;
                SignalRDevLogger.Instance.SendToClient(x);
            }
        }
    }
}
