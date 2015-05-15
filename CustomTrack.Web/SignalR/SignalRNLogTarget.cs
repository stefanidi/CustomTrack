using Microsoft.AspNet.SignalR;
using NLog;
using NLog.Targets;
using System;

namespace BriefBox.App.SignalR
{
    /// <summary>
    /// Used by JS log viewer to connect to. 
    /// </summary>
    public class DevLoggerHub : Hub
    {
    }

    /// <summary>
    /// Used by NLog custom target to output to SignalR for DEV
    /// </summary>
    public class SignalRDevLogger
    {
        private static SignalRDevLogger _singlton;
        private readonly Func<IHubContext> _context;

        private SignalRDevLogger()
        {
            _context = () => GlobalHost.ConnectionManager.GetHubContext<DevLoggerHub>();
        }

        public static SignalRDevLogger Instance { get { if (_singlton == null) _singlton = new SignalRDevLogger(); return _singlton; } }

        public void SendToClient(double x)
        {
            _context().Clients.All.addPoint(x);
        }
    }
}