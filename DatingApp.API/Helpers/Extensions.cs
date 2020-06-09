using Microsoft.AspNetCore.Http;

namespace DatingApp.API.Helpers
{
    // methods in static class can be used without creating a new instance of the class
    public static class Extensions
    {
        public static void AddApplicationError(this HttpResponse response, string message)
        {
           // adding additional headers in respose
           response.Headers.Add("Application-Error", message);
           response.Headers.Add("Access-Control-Expose-Headers","Application-Error");
           response.Headers.Add("Access-Control-Allow-Origin","*"); 
        
        }
    }
}