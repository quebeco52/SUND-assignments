## Question: Your project now has two package.json files: one for the API and one for the client. Why? What would go wrong if you installed React in the API's package.json ?
They are two separate applications running in different environments, Putting React in the API would bloat it.


## Question: What does Vite do for you while you run npm run dev ? Try changing a text in App.tsx and saving. What happens in the browser?
Vite runs a dev server and things change in realtime when changing text


## Question: In your own words: what is CORS, and why did the browser block the request? Why did the same request work fine in Postman?

CORS is security a browser security mechanism that controls the confections between different Origins. Postman is not a browser that runs third party code.



## Question: Why do we write origin: "http://localhost:5173" instead of allowing every origin? What would you have to change when the frontend is put online?

this make so only a trusted frontend can make make requests to the API. when Online I would need to point it to the URL



## Question: Why does React need a key on every item in a list? Why is book.id a better key than the index, especially once you can delete books?

It need a key to effectively modified the DOM. An index change every time every time a item is deleted with can make handling DOM hard



## Question: Explain in your own words what useState and useEffect do in this component. What would happen if you removed the empty array [] from useEffect ?

useState stores reactive data and triggers a re-render setBooks is called. [] tells React to run it only once