export default function handler(req, res) {
    console.log(req.body);
  
    // Then save the post data to a database
    res.status(200).json({ message: "Post created successfully" });
  }