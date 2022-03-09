const router = require('express').Router();
const { User, Post, Comment, Vote } = require('../../models');

// Respondes all Users from User table.
router.get('/', (req, res) => {
  // Returns users info from the User table but does not return any passwords.
  User.findAll({
    attributes: { exclude: ['password'] }
  })
    // Take the data User.findAll returned and respondes that data.
    .then(dbUserData => res.json(dbUserData))
    // Catches err, console.logs it and respondes it with a status of 500 internal server error.
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Respondes User with a specific id.
router.get('/:id', (req, res) => {
  // Finds User with a specific id and returns that users info
  // Stops User password from being returned.
  // Includes all of the data from all of the Users posts in the return.
  // Includes all of the data from all of thier comments.
  // Includes the titles of all of the post they commented on.
  // Includes all the titles of the postes they voted on.
  User.findOne({
    attributes: { exclude: ['password'] },
    where: {
      id: req.params.id
    },
    include: [
      {
        model: Post,
        attributes: ['id', 'title', 'post_url', 'created_at']
      },
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'created_at'],
        include: {
          model: Post,
          attributes: ['title']
        }
      },
      {
        model: Post,
        attributes: ['title'],
        through: Vote,
        as: 'voted_posts'
      }
    ]
  })
    // If no user exist with this id respond with an err.
    // Else respond user data.
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }

      res.json(dbUserData);
    })
    // Catches err, console.logs it and respondes it with a status of 500 internal server error.
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Creates User
// Takes input data, puts data into a row of the User table and respondes everything in the new row.
router.post('/', (req, res) => {
  // Puts new data into a new row inside of User table and returns new data.
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })
    .then(dbUserData => {
      // Creates session data, logs in the user and, respondes new User data.
      req.session.save(() => {
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.loggedIn = true;
  
        res.json(dbUserData);
      });
    })
    // Catches err, console.logs it and respondes it with a status of 500 internal server error.
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Logs user in and responds with the users data if the email and password input are correct.
router.post('/login', (req, res) => {
  // Finds User with specific email address and returns the users info.
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(dbUserData => {
    // If no user exist with that email respond with an err.
    if (!dbUserData) {
      res.status(400).json({ message: 'No user with that email address!' });
      return;
    }

    // Checks if password matches the input.
    const validPassword = dbUserData.checkPassword(req.body.password);

    // If password input is wrong respond with err.
    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect password!' });
      return;
    }

    //Create session data, log user in and respondes with user data and a message.
    req.session.save(() => {
      req.session.user_id = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = true;
  
      res.json({ user: dbUserData, message: 'You are now logged in!' });
    });
  });
});


// Logs user out if user is logged in by destroying session data.
router.post('/logout', (req, res) => {
  // If user is logged in destory sesssion data and respond with No Content status.
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  }
  // If user is not logged in respond with Not Found.
  else {
    res.status(404).end();
  }
});

// Hashes new password and Updates user by id in db with new input data.
// Respondes with number of rows affected.
router.put('/:id', (req, res) => {
  // Hashes new password then Updates user by id in data base.
  User.update(req.body, {
    individualHooks: true,
    where: {
      id: req.params.id
    }
  })
    // If User with this id does not exist respond with err and return.
    // Else respond with number of rows affected
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    // Catches err, console.logs it and respondes it with a status of 500 internal server error.
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Deletes User by id.
router.delete('/:id', (req, res) => {
  // Deletes User from db by id.
  User.destroy({
    where: {
      id: req.params.id
    }
  })
    // If user with this id does not exist respond with err.
    // Else respond with number of rows deleted.
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    // Catches err, console.logs it and respondes it with a status of 500 internal server error.
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
