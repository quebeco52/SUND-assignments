import { useEffect } from "react";
    import axios from "axios";

    function App() {
        const fetchBooks = async () => {
        const response = await axios.get("http://localhost:3000/books");
        console.log("response.data:", response.data);
        console.log("response.data.data:", response.data.data);
    };

    useEffect(() => {
        fetchBooks();
    }, []);

        return <h1>Library</h1>;
    }

    export default App;
