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
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}