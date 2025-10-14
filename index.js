// Used to upload videos to R2

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const key = url.pathname.slice(1); // the filename in the bucket

    // protect bucket with a secret key
    if (request.headers.get("X-Custom-Auth-Key") !== env.AUTH_KEY_SECRET) {
      return new Response("Forbidden", { status: 403 });
    }

    switch (request.method) {
      case "PUT":
        await env.VIDEOS_BUCKET.put(key, request.body, {
          httpMetadata: request.headers,
        });
        return new Response(`Uploaded ${key} successfully!`);
      
      case "GET":
        const object = await env.VIDEOS_BUCKET.get(key);
        if (!object) return new Response("Not Found", { status: 404 });
        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set("etag", object.httpEtag);
        return new Response(object.body, { status: 200, headers });
      
      case "DELETE":
        await env.VIDEOS_BUCKET.delete(key);
        return new Response(`Deleted ${key}!`);
      
      default:
        return new Response("Method Not Allowed", { status: 405 });
    }
  },
};
