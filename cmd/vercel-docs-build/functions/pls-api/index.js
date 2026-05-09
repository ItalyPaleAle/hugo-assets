var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// functions/pls-api.ts
var pls_api_exports = {};
__export(pls_api_exports, {
  default: () => pls_api_default
});
module.exports = __toCommonJS(pls_api_exports);
var pls_api_default = {
  async fetch(request) {
    if (!process.env.PLAUSIBLE_API_EVENT) {
      return Response.json({ error: "PLAUSIBLE_API_EVENT analytics not configured" }, { status: 500 });
    }
    const newReq = new Request(process.env.PLAUSIBLE_API_EVENT, new Request(request, {}));
    if (!newReq.headers.get("x-forwarded-for")) {
      const val = newReq.headers.get("x-real-ip");
      if (val) {
        newReq.headers.set("x-forwarded-for", val);
      }
    }
    const oidcToken = request.headers.get("x-vercel-oidc-token");
    if (oidcToken) {
      newReq.headers.set("authorization", "Bearer " + oidcToken);
    }
    newReq.headers.delete("Host");
    newReq.headers.delete("Cookie");
    for (const key of newReq.headers.keys()) {
      if (key.startsWith("x-vercel-")) {
        newReq.headers.delete(key);
      }
    }
    const upstreamResponse = await fetch(newReq);
    const responseHeaders = new Headers(upstreamResponse.headers);
    for (const key of responseHeaders.keys()) {
      if (key.toLowerCase().startsWith("cf-")) {
        responseHeaders.delete(key);
      }
    }
    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: responseHeaders
    });
  }
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vcGxzLWFwaS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gSGFuZGxlIHByb3h5IGZvciBQbGF1c2libGUgaWYgZW5hYmxlZCAoaWYgdGhlIFBMQVVTSUJMRV9BUElfRVZFTlQgZW52IHZhciBjb250YWlucyB0aGUgVVJMIG9mIHRoZSBQbGF1c2libGUgc2VydmVyLCB3aXRoIGh0dHBzIHByZWZpeClcbi8vIFByb3h5IChubyBjYWNoZSkgdGhlIG1lc3NhZ2Ugc2VuZGluZyB0aGUgcmVxdWVzdCAoZnJvbSAvcGxzL2FwaS9ldmVudCB0byAke1BMQVVTSUJMRV9BUElfRVZFTlR9LCB3aGljaCBzaG91bGQgZW5kIHdpdGggL2FwaS9ldmVudClcbmV4cG9ydCBkZWZhdWx0IHtcbiAgYXN5bmMgZmV0Y2gocmVxdWVzdDogUmVxdWVzdCkge1xuICAgIGlmICghcHJvY2Vzcy5lbnYuUExBVVNJQkxFX0FQSV9FVkVOVCkge1xuICAgICAgICByZXR1cm4gUmVzcG9uc2UuanNvbih7IGVycm9yOiAnUExBVVNJQkxFX0FQSV9FVkVOVCBhbmFseXRpY3Mgbm90IGNvbmZpZ3VyZWQnIH0sIHsgc3RhdHVzOiA1MDAgfSlcbiAgICB9XG4gIFxuICAgIGNvbnN0IG5ld1JlcSA9IG5ldyBSZXF1ZXN0KHByb2Nlc3MuZW52LlBMQVVTSUJMRV9BUElfRVZFTlQsIG5ldyBSZXF1ZXN0KHJlcXVlc3QsIHt9KSlcblxuICAgIC8vIFNldCB0aGUgWC1Gb3J3YXJkZWQtRm9yIGhlYWRlclxuICAgIC8vIEZpcnN0LCBjaGVjayBpZiB0aGUgcmVxdWVzdCBoYWQgYW4gWC1Gb3J3YXJkZWQtRm9yIGFscmVhZHlcbiAgICBpZiAoIW5ld1JlcS5oZWFkZXJzLmdldCgneC1mb3J3YXJkZWQtZm9yJykpIHtcbiAgICAgIC8vIEZhbGxiYWNrIHRvIFgtUmVhbC1JUFxuICAgICAgY29uc3QgdmFsID0gbmV3UmVxLmhlYWRlcnMuZ2V0KCd4LXJlYWwtaXAnKVxuICAgICAgaWYgKHZhbCkge1xuICAgICAgICBuZXdSZXEuaGVhZGVycy5zZXQoJ3gtZm9yd2FyZGVkLWZvcicsIHZhbClcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTZXQgdGhlIEF1dGhvcml6YXRpb24gaGVhZGVyIHdpdGggdGhlIFZlcmNlbCBPSURDIHRva2VuXG4gICAgY29uc3Qgb2lkY1Rva2VuID0gcmVxdWVzdC5oZWFkZXJzLmdldCgneC12ZXJjZWwtb2lkYy10b2tlbicpXG4gICAgaWYgKG9pZGNUb2tlbikge1xuICAgICAgLy8gQWRkIHRoZSBWZXJjZWwgT0lEQyB0b2tlbiB0byB0aGUgcmVxdWVzdFxuICAgICAgbmV3UmVxLmhlYWRlcnMuc2V0KCdhdXRob3JpemF0aW9uJywgJ0JlYXJlciAnICsgb2lkY1Rva2VuKVxuICAgIH1cblxuICAgIC8vIE5lZWQgdG8gcmVtb3ZlIHRoZSBIb3N0IGFuZCBDb29raWUgaGVhZGVycywgb3IgdGhlIHJlcXVlc3Qgd2lsbCBmYWlsXG4gICAgLy8gU2hvdWxkIGFsc28gcmVtb3ZlIGFsbCBWZXJjZWwgaGVhZGVyc1xuICAgIG5ld1JlcS5oZWFkZXJzLmRlbGV0ZSgnSG9zdCcpXG4gICAgbmV3UmVxLmhlYWRlcnMuZGVsZXRlKCdDb29raWUnKVxuICAgIGZvciAoY29uc3Qga2V5IG9mIG5ld1JlcS5oZWFkZXJzLmtleXMoKSkge1xuICAgICAgaWYgKGtleS5zdGFydHNXaXRoKCd4LXZlcmNlbC0nKSkge1xuICAgICAgICBuZXdSZXEuaGVhZGVycy5kZWxldGUoa2V5KVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIE1ha2UgdGhlIHJlcXVlc3RcbiAgICBjb25zdCB1cHN0cmVhbVJlc3BvbnNlID0gYXdhaXQgZmV0Y2gobmV3UmVxKVxuXG4gICAgLy8gU3RyaXAgQ2xvdWRmbGFyZS1zcGVjaWZpYyByZXNwb25zZSBoZWFkZXJzXG4gICAgY29uc3QgcmVzcG9uc2VIZWFkZXJzID0gbmV3IEhlYWRlcnModXBzdHJlYW1SZXNwb25zZS5oZWFkZXJzKVxuICAgIGZvciAoY29uc3Qga2V5IG9mIHJlc3BvbnNlSGVhZGVycy5rZXlzKCkpIHtcbiAgICAgIGlmIChrZXkudG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKCdjZi0nKSkge1xuICAgICAgICByZXNwb25zZUhlYWRlcnMuZGVsZXRlKGtleSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTZW5kIHRoZSByZXNwb25zZVxuICAgIHJldHVybiBuZXcgUmVzcG9uc2UodXBzdHJlYW1SZXNwb25zZS5ib2R5LCB7XG4gICAgICBzdGF0dXM6IHVwc3RyZWFtUmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgc3RhdHVzVGV4dDogdXBzdHJlYW1SZXNwb25zZS5zdGF0dXNUZXh0LFxuICAgICAgaGVhZGVyczogcmVzcG9uc2VIZWFkZXJzLFxuICAgIH0pXG4gIH0sXG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUVBLElBQU8sa0JBQVE7QUFBQSxFQUNiLE1BQU0sTUFBTSxTQUFrQjtBQUM1QixRQUFJLENBQUMsUUFBUSxJQUFJLHFCQUFxQjtBQUNsQyxhQUFPLFNBQVMsS0FBSyxFQUFFLE9BQU8sK0NBQStDLEdBQUcsRUFBRSxRQUFRLElBQUksQ0FBQztBQUFBLElBQ25HO0FBRUEsVUFBTSxTQUFTLElBQUksUUFBUSxRQUFRLElBQUkscUJBQXFCLElBQUksUUFBUSxTQUFTLENBQUMsQ0FBQyxDQUFDO0FBSXBGLFFBQUksQ0FBQyxPQUFPLFFBQVEsSUFBSSxpQkFBaUIsR0FBRztBQUUxQyxZQUFNLE1BQU0sT0FBTyxRQUFRLElBQUksV0FBVztBQUMxQyxVQUFJLEtBQUs7QUFDUCxlQUFPLFFBQVEsSUFBSSxtQkFBbUIsR0FBRztBQUFBLE1BQzNDO0FBQUEsSUFDRjtBQUdBLFVBQU0sWUFBWSxRQUFRLFFBQVEsSUFBSSxxQkFBcUI7QUFDM0QsUUFBSSxXQUFXO0FBRWIsYUFBTyxRQUFRLElBQUksaUJBQWlCLFlBQVksU0FBUztBQUFBLElBQzNEO0FBSUEsV0FBTyxRQUFRLE9BQU8sTUFBTTtBQUM1QixXQUFPLFFBQVEsT0FBTyxRQUFRO0FBQzlCLGVBQVcsT0FBTyxPQUFPLFFBQVEsS0FBSyxHQUFHO0FBQ3ZDLFVBQUksSUFBSSxXQUFXLFdBQVcsR0FBRztBQUMvQixlQUFPLFFBQVEsT0FBTyxHQUFHO0FBQUEsTUFDM0I7QUFBQSxJQUNGO0FBR0EsVUFBTSxtQkFBbUIsTUFBTSxNQUFNLE1BQU07QUFHM0MsVUFBTSxrQkFBa0IsSUFBSSxRQUFRLGlCQUFpQixPQUFPO0FBQzVELGVBQVcsT0FBTyxnQkFBZ0IsS0FBSyxHQUFHO0FBQ3hDLFVBQUksSUFBSSxZQUFZLEVBQUUsV0FBVyxLQUFLLEdBQUc7QUFDdkMsd0JBQWdCLE9BQU8sR0FBRztBQUFBLE1BQzVCO0FBQUEsSUFDRjtBQUdBLFdBQU8sSUFBSSxTQUFTLGlCQUFpQixNQUFNO0FBQUEsTUFDekMsUUFBUSxpQkFBaUI7QUFBQSxNQUN6QixZQUFZLGlCQUFpQjtBQUFBLE1BQzdCLFNBQVM7QUFBQSxJQUNYLENBQUM7QUFBQSxFQUNIO0FBQ0Y7IiwKICAibmFtZXMiOiBbXQp9Cg==
