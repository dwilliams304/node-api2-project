// implement your posts router here
const express = require('express');

const Post = require('./posts-model');

const router = express.Router();



router.get('/', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: 'The posts information could not be retrieved' })
    }
})


router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        if (!post) {
            res.status(404).json({ message: 'The post with the specified ID does not exist' })
        } else {
            res.json(post);
        }
    } catch (err) {
        res.status(500).json({ message: 'The post information could not be retrieved' });
    }
})


router.post('/', (req, res) => {
    const { title, contents } = req.body;

    if (!title || !contents) {
        res.status(400).json({ message: 'Please provide title and contents for the post' })
    } else {
        Post.insert(req.body)
            .then(({ id }) => {
                return Post.findById(id)
            })
            .then(post => {
                res.status(201).json(post);
            })
            .catch(err => {
                res.status(500).json({
                    message: 'There was an error while saving the post to the database',
                    stack: err.stack
                })
            })
    }
})


router.put('/:id', async (req, res) => {
    const { title, contents } = req.body;
    if (!title || !contents) {
        res.status(400).json({
            message: 'Please provide title and contents for the post'})
    }
    else {

        try {
            const { id } = req.params;

            const updatedPost = await Post.update(id, { title, contents });
            if (!updatedPost) {
                res.status(404).json({
                    message: 'The post with the specified ID does not exist',
                })
            } else {
                const post = await Post.findById(id);
                res.status(200).json(post);
            }

        } catch (err) {
            res.status(500).json({
                message: '',
                stack: err.stack
            })
        }
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPost = await Post.findById(id);
        const toDelete = await Post.remove(id);
        if (!toDelete) {
            res.status(404).json({ message: 'The post with the specified ID does not exist' });
        }
        else {
            res.status(200).json(deletedPost);
        }
    } catch (err) {
        res.status(500).json({ message: 'The post could not be removed' });
    }
})

router.get('/:id/comments', async (req, res) => {
    try {
        const { id } = req.params;
        const comments = await Post.findPostComments(id);
        if (comments.length === 0) {
            res.status(404).json({ message: 'The post with the specified ID does not exist' })
        } else {
            res.status(200).json(comments);
        }
    } catch (err) {
        res.status(500).json({ message: 'The comments information could not be retrieved' })
    }

})


module.exports = router;