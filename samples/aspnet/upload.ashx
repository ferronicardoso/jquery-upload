<%@ WebHandler Language="C#" Class="upload" %>

using System;
using System.Web;

public class FileUploadResponse
{
    public string Name { get; set; }
    public string ContentType { get; set; }
    public int ContentLength { get; set; }
}

public class upload : IHttpHandler
{
    public void ProcessRequest(HttpContext context)
    {

        context.Response.ContentType = "application/json";
        context.Response.Expires = -1;

        var lstFileUpload = new System.Collections.Generic.List<FileUploadResponse>();

        try
        {
            var files = context.Request.Files;

            for (int i = 0; i < files.Count; i++)
            {
                lstFileUpload.Add(new FileUploadResponse()
                {
                    Name = files[i].FileName,
                    ContentType = files[i].ContentType,
                    ContentLength = files[i].ContentLength
                });
            }

            context.Response.Write(lstFileUpload.ToArray());
            context.Response.StatusCode = 200;
        }
        catch (Exception ex)
        {
            context.Response.Write("Error: " + ex.Message);
        }
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}