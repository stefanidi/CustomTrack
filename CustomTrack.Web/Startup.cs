
using System.Web.Mvc;
using Microsoft.AspNet.SignalR.Hubs;
using Ninject;
using Owin;
using Microsoft.Owin;
using Microsoft.AspNet.SignalR;
using Microsoft.Owin.Cors;
using Newtonsoft.Json;
[assembly: OwinStartup(typeof(BriefBox.App.Startup))]
namespace BriefBox.App
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            SetupSignalRSerialiser();

            var unityHubActivator = new MvcHubActivator();

            GlobalHost.DependencyResolver.Register(
                typeof(IHubActivator),
                () => unityHubActivator);

            //Cross Domain SignalR - This will allow NLog viewer:
            app.Map("/signalr", map =>
            {
                map.UseCors(CorsOptions.AllowAll);
                var hubConfiguration = new HubConfiguration() { EnableDetailedErrors = true };
                map.RunSignalR(hubConfiguration);
            });
        }

        /// <summary>
        /// Implemented using this article:
        /// http://www.tomdupont.net/2014/01/dependency-injection-with-signalr-and.html
        /// </summary>
        public class MvcHubActivator : IHubActivator
        {
            public IHub Create(HubDescriptor descriptor)
            {
                return (IHub)DependencyResolver.Current
                    .GetService(descriptor.HubType);
            }
        }

        private void SetupSignalRSerialiser()
        {
            var serializer = GlobalHost.DependencyResolver.Resolve<JsonSerializer>();//new JsonSerializer();
            serializer.Converters.Add(new Newtonsoft.Json.Converters.StringEnumConverter());
        }
    }
}