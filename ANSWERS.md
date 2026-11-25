## Question: Your project now has two package.json files: one for the API and one for the client. Why? What would go wrong if you installed React in the API's package.json ?
They are two separate applications running in different environments, Putting React in the API would bloat it.


## Question: What does Vite do for you while you run npm run dev ? Try changing a text in App.tsx and saving. What happens in the browser?
Vite runs a dev server and things change in realtime when changing text


## Question: In your own words: what is CORS, and why did the browser block the request? Why did the same request work fine in Postman?



## Question: Why do we write origin: "http://localhost:5173" instead of allowing every origin? What would you have to change when the frontend is put online?



## Question: Why does React need a key on every item in a list? Why is book.id a better key than the index, especially once you can delete books?



## Question: Explain in your own words what useState and useEffect do in this component. What would happen if you removed the empty array [] from useEffect ?