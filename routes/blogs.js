var express = require('express');
const { route } = require('../app');
var router = express.Router();

var blogs = require('../public/sampleBlogs');
const blogPosts = blogs.blogPosts;



//http://localhost:4000/blogs/all

router.get('/all', function (req, res, next) {

    const sortOrder = req.query.sort;
    blogPosts.sort((a, b) => {
        const aCreatedAt = a.createdAt
        const bCreatedAt = b.createdAt

        /* Compare by date object for extra utility
        const aCreatedAt = new Date(a.createdAt)
        const bCreatedAt = new Date(b.createdAt) */

        if (sortOrder === "asc") {
            if (aCreatedAt < bCreatedAt) {
                return -1;
            }
            if (aCreatedAt > bCreatedAt) {
                return 1;
            }
        }
        if (sortOrder === "desc") {
            if (aCreatedAt > bCreatedAt) {
                return -1;
            }
            if (aCreatedAt < bCreatedAt) {
                return 1;
            }
        }
        return 0;
    })

    res.json(blogPosts.map(el => el.id));
    // above is the same as: res.json(blogPosts.map(el) => {return el.id}));
    // which maps through each element of the array and returns the id# of each element

});





// /blogs/:blogId should return only a single blog post that matches the id field of the blog post to the blogId route param. Add query param handling to the /blogs/all route. 


//http://localhost:4000/blogs/getblogbyid/?blogid=4  using query params
router.get('/getblogbyid', (req, res) => {

    // extract blogid from query
    const queryBlogId = req.query.blogid;
    // console.log(req.query);
    // console.log("query blog id = " + queryBlogId);
    // res.json(`${queryBlogId} is the query blog id`); // test to get blog id on screen not just in console

    // find the blogpost that has an id that matches the param blogid
    const foundBlog = blogPosts.find((blog) => {
        return blog.id === queryBlogId;
    })

    // return blogpost
    res.json(foundBlog);

})



//http://localhost:4000/blogs/b/4  using route params
router.get('/b/:blogId', (req, res) => {
    const routeBlogId = req.params.blogId;
    // console.log("route blog id = " + routeBlogId)
    // res.json(`${routeBlogId} is the route blog id`); // test to get blog id on screen not just in console

    // find the blogpost that has an id that matches the param blogid
    const foundBlog = blogPosts.find((blog) => {
        return blog.id === routeBlogId;
    })

    // return blogpost
    res.json(foundBlog);

})


module.exports = router;