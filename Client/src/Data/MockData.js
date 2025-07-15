// src/mockData.js

export const mockData = {
    post: {
      title: "The Beauty of React and Tailwind CSS",
      content: "<p>React and Tailwind CSS are a powerful combination for building modern web applications. They offer flexibility, ease of use, and excellent styling capabilities.</p><p>In this post, we will explore how to integrate these two technologies to create beautiful and functional UIs.</p>",
      author: "John Doe",
      datePosted: "2023-04-15T08:00:00Z",
      bannerImage: ["https://via.placeholder.com/800x400"],
      likes: [],
      comments: [
        {
          _id: "1",
          author: "Alice",
          content: "Great post! I found the information very useful.",
          datePosted: "2023-04-16T10:00:00Z",
          replies: [
            {
              _id: "1-1",
              author: "John Doe",
              content: "Thank you, Alice! I'm glad you found it helpful.",
              datePosted: "2023-04-16T12:00:00Z",
              replies: []
            }
          ]
        },
        {
          _id: "2",
          author: "Bob",
          content: "Could you provide more examples on integrating Tailwind CSS with React?",
          datePosted: "2023-04-17T09:00:00Z",
          replies: [
            {
              _id: "2-1",
              author: "John Doe",
              content: "Sure, Bob! I will add more examples in my next post.",
              datePosted: "2023-04-17T11:00:00Z",
              replies: []
            },
            {
              _id: "2-2",
              author: "Charlie",
              content: "I agree with Bob. More examples would be great!",
              datePosted: "2023-04-17T13:00:00Z",
              replies: []
            }
          ]
        }
      ]
    }
  };
  