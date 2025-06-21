import { useEffect } from "react";  
function Home() {
  useEffect(() => {
  fetch("http://localhost:3000/", {
    method: "GET",
    credentials: "include" // 
  })
    .then(res => res.json())
    .then(data => {
      console.log("Server response:", data);
    })
    .catch(err => {
      console.error("Error:", err);
    });
}, []);
  return (
    <div className="text-center mt-10 text-xl">
      hello guys
    </div>
  );
}

export default Home;
