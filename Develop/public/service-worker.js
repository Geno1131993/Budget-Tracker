import { response } from "express";

var CACHE = "site_cache";
const DATA = "data_cache";


var urls = [
    "/",
    "/db.js",
    "/index.js",
    "/manifest.json",
    "/style.css",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
];



self.addEventListener("install", event =>{
    event.waitUntil(
        caches.open(CACHE).then(cache =>{
            return cache.addAll(urls);
        })
    );
});



self.addEventListener("fetch", function(event){
    if(event.request.url.includes("/api/")){
        event.respondWith(
            caches.open(DATA).then(cache =>{
                return fetch(event.request).then(response =>{
                    if(response.status == 200){
                        cache.put(event.request.url, response.clone());
                    }
                    return response;
                }).catch(err =>{
                    return cache.match(event.request);
                });
    }
    return;
});




event.respondWith(
    fetch(event.request).catch(function(){
        return caches.match(event.request).then(response =>{
            if(response){
                return response;
            } else if(event.request.headers.get("accept").includes("text/html")){
                return caches.match("/");
            }
        });
    });

