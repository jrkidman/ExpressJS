var express = require('express');
var router = express.Router();

var blogs = require('../public/sampleBlogs');
// const blogPosts = blogs.blogPosts;
const { blogsDB } = require("../mongo");
const { reset } = require('chalk');
const { Db } = require('mongodb');



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

        if (sort === "asc") {
            sort = 1;
        }
        if (sort === "desc") {
            sort = -1;
        }
        const collection = await blogsDB().collection("blogs50")
        const blogs50 = await collection.find({}).sort({ [sortField]: sort }).toArray();
        res.json(blogs50);
    }
    catch (e) {
        res.status(500).send("Error fetching posts.")
    }
});


// //http://localhost:4000/blogs/singleblog/#  
router.get('/singleBlog/:blogId', async function (req, res) {
    try {
        const blogId = Number(req.params.blogId);
        const collection = await blogsDB().collection("blogs50");
        const foundBlog = await collection.findOne({ id: blogId });

        if (!foundBlog) {
            const noBlog = {
                title: '',
                text: "This blog does not exist.",
                author: '',
                id: ''
            }
            res.json(noBlog);
        } else {
            res.json(foundBlog);
        }
    } catch (e) {
        res.status(500).send("Error fetching posts.")
    }
})


// * Create a new route /postblog and use the res.render() method to display this page to the browser.
router.get('/postblog', async function (req, res) {
    res.render('postBlog');
})


// * Create a new POST route /blogs/submit, it should receive the new blog post information from the browser and add it to the array of blogs in sampleBlogs.js. Note that the createdAt and the id are NOT provided from the front end. You will have to create those two fields yourself server-side and add them to the incoming blog post data before adding it to the blogPosts array. Don't forget to send an "OK" response to the browser after the save!
router.post('/submit', async function (req, res) {
    try {
        const collection = await blogsDB().collection("blogs50");
        const sortedBlogArray = await collection.find({}).sort({ id: 1 }).toArray();
        const lastBlog = sortedBlogArray[sortedBlogArray.length - 1]

        const newPost = {
            title: req.body.title,
            text: req.body.text,
            author: req.body.author,
            createdAt: new Date(),
            lastModified: new Date(),
            category: req.body.category,
            id: Number(lastBlog.id + 1)
        }
        await collection.insertOne(newPost);
        res.status(200).send("Post submitted");

    } catch (e) {
        res.status(500).send("Error fetching posts.")
    }
})

// * updatePost(blogId, title, text, author, category) should find a post matching the id of blogId and then update the title, 
// text, author and category fields with the inputted information. Remember, since lastModified is a representation of when the 
// post was last updated (including creation), you will have to update lastModified to the current date and time as well.
router.put('/update-blog/:blogId', async function (req, res) {
    try {
        const collection = await blogsDB().collection('blogs50');
        const blogId = Number(req.params.blogId);
        const ogBlog = await collection.findOne({ id: blogId });
        if (!ogBlog) {
            res.send("Blog Id: " + blogId + " does not exist.")
        }
        else {
            let updateBlog = req.body;
            const blogTitle = updateBlog.title ? updateBlog.title : ogBlog.title;
            const blogText = updateBlog.text ? updateBlog.text : ogBlog.text;
            const blogAuthor = updateBlog.author ? updateBlog.author : ogBlog.author;
            const blogCategory = updateBlog.category ? updateBlog.category : ogBlog.category;

            updateBlog = {
                lastModified: new Date(),
                title: blogTitle,
                text: blogText,
                author: blogAuthor,
                category: blogCategory,
            };

            await collection.updateOne({
                id: blogId
            }, {
                $set: updateBlog
            });

            res.status(200).send("Post successfully updated.")
        };
    } catch (error) {
        res.status(500).send("Error updating blog." + error)
    }
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
router.delete('/deleteBlog/:blogId', async (req, res) => {
    try {
        const blogId = Number(req.params.blogId);
        const collection = await blogsDB().collection("blogs50");
        const blogToDelete = await collection.deleteOne({ id: blogId })

        if (blogToDelete.deletedCount === 1){
            res.send("Succesfully deleted.").status(200)
        }
        else{
            res.send("This blog does not exist.").status(404)
        }


    } catch (error) {
        res.status(500).send("Error deleting blog." + error)
    }
})



module.exports = router;