const _ = require('lodash');

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
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}