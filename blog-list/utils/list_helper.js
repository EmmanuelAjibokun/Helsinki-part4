const _ = require('lodash');

const blogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
    }  
]

const dummy = (blogs) => {
  return 1;
}

const totalLikes = (blogs) => {
    const reducer = blogs.reduce((sum, item) => {
        return sum + item.likes
    }, 0)
    console.log("total", reducer);
    return reducer;
}

const favoriteBlog = (blogs) => {
    // update blog with the current highest likes
    let highestLikes = 0;
    for (let i = 0; i < blogs.length; i++) {
        const element = blogs[i];
        if (highestLikes < blogs[i].likes) {
            highestLikes = blogs[i].likes;
            continue;
        }
    }
    const favorite = blogs.filter(item => item.likes === highestLikes)
    return favorite[0];
}

const mostBlogs = (blogs) => {
    // group blogs by author into an object
    const grouped = _.groupBy(blogs, 'author');

    // transform groups into { author, blogs } objects
    const authorsBlogCount = _.map(grouped, (posts, author) => ({
        author,
        blogs: posts.length,
    }))

    // find the object with the highest blogs count
    return _.maxBy(authorsBlogCount, "blogs");
}

const mostLikes = (blogs) => {
    // group blogs by author into an object
    const grouped = _.groupBy(blogs, 'author');

    // transform groups into { author, blogs } objects
    const authorsLikesCount = _.map(grouped, (posts, author) => {
        let totalLikes = 0;
        for (let i = 0; i < posts.length; i++) {
            totalLikes += posts[i].likes;
            
        }
        return { author, likes: totalLikes }
    })

    // find the object with the highest blogs count
    return _.maxBy(authorsLikesCount, "likes");
}

module.exports = {
  blogs,
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}