var express = require('express');
var router = express.Router();

var blogs = require('../public/sampleBlogs');
const blogPosts = blogs.blogPosts;

const {blogsDB} = require("../mongo");

//http://localhost:4000/blogs
router.get("/", async function (req, res, next) {
    try {
        const collection = await blogsDB().collection("blogs50")
        const blogs50 = await collection.find({}).toArray();
        res.json(blogs50);
    }
    catch (e) {
        res.status(500).send("Error fetching posts.")
    }
})


//http://localhost:4000/blogs/all
router.get('/all', async function (req, res, next) {
    try {
        let sortField = req.query.sortField;
        let sort = req.query.sort;
        if (sort === "asc"){
            sort = 1;
        }
        if (sort === "desc"){
            sort = -1;
        }

        const collection = await blogsDB().collection("blogs50")
        const blogs50 = await collection.find({}).sort({[sortField] : sort}).toArray();

    res.json(blogs50);
    } 
    catch (e) {
        res.status(500).send("Error fetching posts.")
    }
});




// let sortBlogs = (order) => {
//     if (order === 'asc') {
//         return blogPosts.sort(function (a, b) {
//             return new Date(a.createdAt) - new Date(b.createdAt)
//         })
//     } else if (order === 'desc') {
//         return blogPosts.sort(function (a, b) {
//             return new Date(b.createdAt) - new Date(a.createdAt)
//         });
//     } else {
//         return blogPosts;
//     }
// };




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


//http://localhost:4000/blogs/singleblog/4  using route params
router.get('/singleblog/:blogId', (req, res) => {
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


// * Create a new route /postblog and use the res.render() method to display this page to the browser.
router.get('/postblog', function (req, res, next) {
    res.render('postBlog');
})



// * Create a new POST route /blogs/submit, it should receive the new blog post information from the browser and add it to the array of blogs in sampleBlogs.js. Note that the createdAt and the id are NOT provided from the front end. You will have to create those two fields yourself server-side and add them to the incoming blog post data before adding it to the blogPosts array. Don't forget to send an "OK" response to the browser after the save!
router.post('/submit', function (req, res, next) {
    console.log(req.body)
    console.log("bloglist before ", blogPosts)
    const today = new Date()
    const newPost = {
        title: req.body.title,
        text: req.body.text,
        author: req.body.author,
        createdAt: today.toISOString(),
        id: String(blogPosts.length + 1)
    }
    blogPosts.push(newPost)
    console.log("bloglist after ", blogPosts)

    res.send("OK");
})

// * Create a new GET route /blogs/displayBlogs that will render the displayBlogs page to the browser. Test that the basic functionality of the page is working by clicking the Get Blogs button, your various blog titles should appear in a list. Test that your postBlog page is still working by adding a new blog then go back to displayBlogs and click Get Blogs again. Your new blog title should appear on the page.

router.get("/displayBlogs", function (req, res, next) {
    res.render("displayBlogs");
})

// * Build out the displayBlogs page functionality by displaying the blog text and author to the page along with the title.

// * Implement the ability for the user to sort blogs by ascending and descending. Hint: the easiest way to do this is to add two new <a> tags to the page which redirect the user to "http://localhost:4000/blogs/all?sort=asc" and "http://localhost:4000/blogs/all?sort=desc". 


// * Stretch Goal: Instead of the two <a> tag redirects, add a dropdown that has two options "asc" and "desc". Impelment jQuery functionality to modify the $.get "http://localhost:4000/blogs/all" url to send through the user selected sort order as query params when the user clicks the "Get Blogs" button.



// * Create a new GET route /blogs/displaysingleblog that will render the displayBlogs page to the browser. Test that the page and /blogs/singleblog/:blogId route works by entering a blogId into the input field and clicking "Get Single Blog"
router.get("/displaySingleBlog", function (req, res, next) {
    res.render("displaySingleBlog");
})


// * Implement the delete single blog functionality. Hint: you will have to create a new route in the blogs.js file to handle the delete. The route should use a ROUTE PARAM to specify which blog to delete. I.E. /blogs/deleteblog/:blogId.

router.delete('/deleteBlog/:blogId', (req, res) => {
    const blogToDelete = req.params.blogId;
    console.log(blogToDelete);
    for (let i = 0; i < blogPosts.length; i++) {
        let blog = blogPosts[i];
        if (blog.id === blogToDelete){
            blogPosts.splice(i,1);
        }
    }
    res.send("Successfully Deleted");

})

module.exports = router;