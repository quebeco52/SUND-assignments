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


## Question: What does event.preventDefault() do? Remove it and test. What happens, and why?

It stops default like in this cases reloading on submitting form, When removed, the page reloads.

## Question: Why does the dropdown use the author's id as value and not the name? What could go wrong if the user typed the author_id by hand?

Because authors can have the same name but not the same id. if the user typed the author_id by hand they could easly mistype and they would not know.

## Question: Your book rules now live in two places: src/schemas.ts in the API and client/src/schemas.ts in the client. What could go wrong when someone changes one and forgets the other? Can you think of a way to keep them in one place?

wey can go out of sync allowing input on the frontend that will be rejected on the backend. It could be mitigated with a shared zod file.



## Question: Explain what books.filter((book) => book.id !== id) does, step by step. Why do we make a new array instead of removing the book from the old one?

.filter loops throw all the books and looks if book.id !== id and then copies them to a new array, we do this to stop react to rerender


## Question: What happened when you deleted a book with a loan, and why? What should the user see on the page in that case?

we get an error because we have a key pointed to that book, The user should get an error that explain this