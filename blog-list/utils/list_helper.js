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

module.exports = {
  dummy,
  totalLikes
}