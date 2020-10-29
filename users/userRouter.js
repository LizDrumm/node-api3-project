const express = require('express');
const Users = require("./userDb");
const Posts = require("../posts/postDb");


const router = express.Router();


router.post('/api/users', [validateUser],(req, res) => {
  // do your magic!
  Users.insert(req.body)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json({message: "Doesn't work!!",
      error: err});
    });
});

router.post('/api/users/:id/posts',  [validateUserId, validatePost], (req, res) => {
  const newPost = {
    user_id: req.params.id,
    text: req.body.text,
  };
  Posts.insert(newPost)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json({
        message: "Doesn't work!!",
        error: err,
      });
    });
});

router.get('/api/users', validateUserId, (req, res) => {
  // do your magic!
  Users.get()
  .then((data) => {
    res.status(200).json(data);
  })
  .catch((error) => {
    console.log(error);
    res.status(500).json({ error: "error getting users" });
  });
});

router.get('/api/users/:id', validateUserId, (req, res) => {
  // do your magic!
  res.status(200).json(req.user);
});

router.get('/api/users/:id/posts', validateUserId, (req, res) => {
  // do your magic!
  Users.getUserPosts(req.params.id)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ errorMessage: "cannot get posts from that id", error: err });
    });
});

router.delete('/api/users/:id', validateUserId,(req, res) => {
  // do your magic!
  Users.remove(req.params.id)
  .then(() => {
    res.status(200).json({ message: " deleted user" });
  })
  .catch((err) => {
    res.status(500).json({ errorMessage: "did not delete that user", error: err });
  });
});

router.put('/api/users/:id', [validateUserId, validateUser],(req, res) => {
  // do your magic!
  Users.update(req.params.id, req.body)
  .then(() => {
    res
      .status(200)
      .json({ message: `successfully updated user id ${req.params.id}` });
  })
  .catch((err) => {
    res.status(400).json({ error: err });
  });
});

//custom middleware

function validateUserId(req, res, next) {
  Users.getById(req.params.id)
  .then((data) => {
    if (data) {
      req.user = data;
      next();
    } else {
      res.status(400).json({ message: "invalid user id" });
    }
  })
  .catch((error) => {
    res.status(500).json({ message: "No" , error:error});
  });
}

function validateUser(req, res, next) {
  if (!req.body) {
    res.status(400).json("missing user data");
  } else if (!req.body.name) {
    res.status(400).json("missing name field");
  } else {
    next();
  }
}

function validatePost(req, res, next) {
 // do your magic!
 let userData = req.body;
 if (!userData) {
   res.status(400).json({
     message: "missing post data",
   });
 } else if (!userData.text) {
   res.status(400).json({ error: "no post text was sent" });
 }
 next();
}

module.exports = router;
