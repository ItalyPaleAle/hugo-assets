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
    return fetch(newReq);
  }
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vcGxzLWFwaS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gSGFuZGxlIHByb3h5IGZvciBQbGF1c2libGUgaWYgZW5hYmxlZCAoaWYgdGhlIFBMQVVTSUJMRV9BUElfRVZFTlQgZW52IHZhciBjb250YWlucyB0aGUgVVJMIG9mIHRoZSBQbGF1c2libGUgc2VydmVyLCB3aXRoIGh0dHBzIHByZWZpeClcbi8vIFByb3h5IChubyBjYWNoZSkgdGhlIG1lc3NhZ2Ugc2VuZGluZyB0aGUgcmVxdWVzdCAoZnJvbSAvcGxzL2FwaS9ldmVudCB0byAke1BMQVVTSUJMRV9BUElfRVZFTlR9LCB3aGljaCBzaG91bGQgZW5kIHdpdGggL2FwaS9ldmVudClcbmV4cG9ydCBkZWZhdWx0IHtcbiAgYXN5bmMgZmV0Y2gocmVxdWVzdDogUmVxdWVzdCkge1xuICAgIGlmICghcHJvY2Vzcy5lbnYuUExBVVNJQkxFX0FQSV9FVkVOVCkge1xuICAgICAgICByZXR1cm4gUmVzcG9uc2UuanNvbih7IGVycm9yOiAnUExBVVNJQkxFX0FQSV9FVkVOVCBhbmFseXRpY3Mgbm90IGNvbmZpZ3VyZWQnIH0sIHsgc3RhdHVzOiA1MDAgfSlcbiAgICB9XG4gIFxuICAgIGNvbnN0IG5ld1JlcSA9IG5ldyBSZXF1ZXN0KHByb2Nlc3MuZW52LlBMQVVTSUJMRV9BUElfRVZFTlQsIG5ldyBSZXF1ZXN0KHJlcXVlc3QsIHt9KSlcblxuICAgIC8vIFNldCB0aGUgWC1Gb3J3YXJkZWQtRm9yIGhlYWRlclxuICAgIC8vIEZpcnN0LCBjaGVjayBpZiB0aGUgcmVxdWVzdCBoYWQgYW4gWC1Gb3J3YXJkZWQtRm9yIGFscmVhZHlcbiAgICBpZiAoIW5ld1JlcS5oZWFkZXJzLmdldCgneC1mb3J3YXJkZWQtZm9yJykpIHtcbiAgICAgIC8vIEZhbGxiYWNrIHRvIFgtUmVhbC1JUFxuICAgICAgY29uc3QgdmFsID0gbmV3UmVxLmhlYWRlcnMuZ2V0KCd4LXJlYWwtaXAnKVxuICAgICAgaWYgKHZhbCkge1xuICAgICAgICBuZXdSZXEuaGVhZGVycy5zZXQoJ3gtZm9yd2FyZGVkLWZvcicsIHZhbClcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTZXQgdGhlIEF1dGhvcml6YXRpb24gaGVhZGVyIHdpdGggdGhlIFZlcmNlbCBPSURDIHRva2VuXG4gICAgY29uc3Qgb2lkY1Rva2VuID0gcmVxdWVzdC5oZWFkZXJzLmdldCgneC12ZXJjZWwtb2lkYy10b2tlbicpXG4gICAgaWYgKG9pZGNUb2tlbikge1xuICAgICAgLy8gQWRkIHRoZSBWZXJjZWwgT0lEQyB0b2tlbiB0byB0aGUgcmVxdWVzdFxuICAgICAgbmV3UmVxLmhlYWRlcnMuc2V0KCdhdXRob3JpemF0aW9uJywgJ0JlYXJlciAnICsgb2lkY1Rva2VuKVxuICAgIH1cblxuICAgIC8vIE5lZWQgdG8gcmVtb3ZlIHRoZSBIb3N0IGFuZCBDb29raWUgaGVhZGVycywgb3IgdGhlIHJlcXVlc3Qgd2lsbCBmYWlsXG4gICAgLy8gU2hvdWxkIGFsc28gcmVtb3ZlIGFsbCBWZXJjZWwgaGVhZGVyc1xuICAgIG5ld1JlcS5oZWFkZXJzLmRlbGV0ZSgnSG9zdCcpXG4gICAgbmV3UmVxLmhlYWRlcnMuZGVsZXRlKCdDb29raWUnKVxuICAgIGZvciAoY29uc3Qga2V5IG9mIG5ld1JlcS5oZWFkZXJzLmtleXMoKSkge1xuICAgICAgaWYgKGtleS5zdGFydHNXaXRoKCd4LXZlcmNlbC0nKSkge1xuICAgICAgICBuZXdSZXEuaGVhZGVycy5kZWxldGUoa2V5KVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIE1ha2UgdGhlIHJlcXVlc3RcbiAgICByZXR1cm4gZmV0Y2gobmV3UmVxKVxuICB9LFxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFQSxJQUFPLGtCQUFRO0FBQUEsRUFDYixNQUFNLE1BQU0sU0FBa0I7QUFDNUIsUUFBSSxDQUFDLFFBQVEsSUFBSSxxQkFBcUI7QUFDbEMsYUFBTyxTQUFTLEtBQUssRUFBRSxPQUFPLCtDQUErQyxHQUFHLEVBQUUsUUFBUSxJQUFJLENBQUM7QUFBQSxJQUNuRztBQUVBLFVBQU0sU0FBUyxJQUFJLFFBQVEsUUFBUSxJQUFJLHFCQUFxQixJQUFJLFFBQVEsU0FBUyxDQUFDLENBQUMsQ0FBQztBQUlwRixRQUFJLENBQUMsT0FBTyxRQUFRLElBQUksaUJBQWlCLEdBQUc7QUFFMUMsWUFBTSxNQUFNLE9BQU8sUUFBUSxJQUFJLFdBQVc7QUFDMUMsVUFBSSxLQUFLO0FBQ1AsZUFBTyxRQUFRLElBQUksbUJBQW1CLEdBQUc7QUFBQSxNQUMzQztBQUFBLElBQ0Y7QUFHQSxVQUFNLFlBQVksUUFBUSxRQUFRLElBQUkscUJBQXFCO0FBQzNELFFBQUksV0FBVztBQUViLGFBQU8sUUFBUSxJQUFJLGlCQUFpQixZQUFZLFNBQVM7QUFBQSxJQUMzRDtBQUlBLFdBQU8sUUFBUSxPQUFPLE1BQU07QUFDNUIsV0FBTyxRQUFRLE9BQU8sUUFBUTtBQUM5QixlQUFXLE9BQU8sT0FBTyxRQUFRLEtBQUssR0FBRztBQUN2QyxVQUFJLElBQUksV0FBVyxXQUFXLEdBQUc7QUFDL0IsZUFBTyxRQUFRLE9BQU8sR0FBRztBQUFBLE1BQzNCO0FBQUEsSUFDRjtBQUdBLFdBQU8sTUFBTSxNQUFNO0FBQUEsRUFDckI7QUFDRjsiLAogICJuYW1lcyI6IFtdCn0K
