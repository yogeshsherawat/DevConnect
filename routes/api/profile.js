const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const request = require('request');
const config = require('config');
const { check, validationResult } = require('express-validator');// using this to validate email, passwrd and name for current app


//@route     api/profile/me
//@desc      Route for getting current User's Profile
//@acess     Private
router.get('/me',
auth
,async(req,res)=>{
    try{
        const profile =  await Profile.findOne({user:req.user.id}).populate('user',['name','avatar']);
        if(!profile){
            return res.status(400).json({msg:'Ther is no profile for this user'});
        }
        res.json(profile);
    }
    catch(err){
        console.log(err.message);
        res.status(500).send('Server Error');
    }
})

// @route    POST api/profile
// @desc     Create or update user profile
// @access   Private
router.post(
    '/',
    [
      auth,
      [
        check('status', 'Status is required')
          .not()
          .isEmpty(),
        check('skills', 'Skills is required')
          .not()
          .isEmpty()
      ]
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      //res.send("No Error");
     
     const {
        company,
        location,
        website,
        bio,
        skills,
        status,
        githubusername,
        youtube,
        twitter,
        instagram,
        linkedin,
        facebook
      } = req.body;
      const profileFields = {};
      if(company)profileFields.company=company; 
      if(location)profileFields.location=location;
      if(website)profileFields.website=website;
      if(bio)profileFields.bio = bio;
      if(status)profileFields.status=status;
      if(githubusername)profileFields.githubusername=githubusername;
      if(skills){ 
        if(typeof(skills)==="object")
        profileFields.skills = skills;
        else
        profileFields.skills=
          skills.split(',').map(skill=>skill.trim());
      }
       profileFields.social = {};
      if(youtube)profileFields.social.youtube = youtube;
      if(linkedin)profileFields.social.linkedin = linkedin;
      if(facebook)profileFields.social.facebook = facebook;
      if(instagram)profileFields.social.instagram = instagram;
      if(twitter)profileFields.social.twitter =twitter;
      
      try {
        // Using upsert option (creates new doc if no match is found):
        // $set is mondo db operator and it updates the item which are already present
        let profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true, upsert: true }
        );
        res.json(profile);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
      
      
      
    
    })
    // @route    GET api/profile
    // @desc     Get all profiles
    // @access   Public
router.get('/', async (req, res) => {
    try {
      const profiles = await Profile.find({}).populate('user', ['name', 'avatar']); // Profile.find() finds all the profiles and populate is used for getting name and avatar from user model
      //console.log(profiles);
      console.log("/api/profile   url called");
      
      res.json(profiles);

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  
 // @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public
router.get('/user/:user_id', async (req, res) => {
    try {
      const profile = await Profile.findOne({
        user: req.params.user_id
      }).populate('user', ['name', 'avatar']);
  
      if (!profile) return res.status(400).json({ msg: 'Profile not found' });
  
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      if (err.kind == 'ObjectId') {
        return res.status(400).json({ msg: 'Profile not found' });
      }
      res.status(500).send('Server Error');
    }
  });

// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private
router.delete('/', auth, async (req, res) => {
    try {
      // Remove user posts
      await Post.deleteMany({ user: req.user.id });
      // Remove profile
      await Profile.findOneAndRemove({ user: req.user.id });
      // Remove user
      await User.findOneAndRemove({ _id: req.user.id });
  
      res.json({ msg: 'User deleted' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  // @route    PUT api/profile/experience
// @desc     Add profile experience
// @access   Private
router.put(
    '/experience',
    [
      auth,
      [
        check('title', 'Title is required')
          .not()
          .isEmpty(),
        check('company', 'Company is required')
          .not()
          .isEmpty(),
        check('from', 'From date is required and needs to be from the past')
          .not()
          .isEmpty()
          //.custom((value, { req }) => (req.body.to ? value < req.body.to : true))
      ]
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
      } = req.body;
  
      const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
      };
  
      try {
        const profile = await Profile.findOne({ user: req.user.id });
  
        profile.experience.unshift(newExp);
  
        await profile.save();
  
        res.json(profile);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  );
// @route    DELETE api/profile/experience/:exp_id
// @desc     Delete experience from profile
// @access   Private

router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
      const foundProfile = await Profile.findOne({ user: req.user.id });
        // filter function is used to filter out some thing 
        // in this code we are filtering out the experience which matches current experience id
      foundProfile.experience = foundProfile.experience.filter(
        exp => exp._id.toString() !== req.params.exp_id
      );
      /* Another mehtod we can use is
      const removeIndex = foundProfile.experience.map(item=>item.id).indexOf(req.params.exp_id);
      foundprofile.experience.splice(removeIndex,1);
      await foundProfile.save();
      */
  
      await foundProfile.save();
      return res.status(200).json(foundProfile);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: 'Server error' });
    }
  });
  // @route    PUT api/profile/education
// @desc     Add profile education
// @access   Private
router.put(
    '/education',
    [
      auth,
      [
        check('school', 'School is required')
          .not()
          .isEmpty(),
        check('degree', 'Degree is required')
          .not()
          .isEmpty(),
        check('fieldofstudy', 'Field of study is required')
          .not()
          .isEmpty(),
        check('from', 'From date is required and needs to be from the past')
          .not()
          .isEmpty()
          //.custom((value, { req }) => (req.body.to ? value < req.body.to : true))
      ]
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
      } = req.body;
  
      const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
      };
  
      try {
        const profile = await Profile.findOne({ user: req.user.id });
  
        profile.education.unshift(newEdu);
  
        await profile.save();
  
        res.json(profile);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  );
  
  // @route    DELETE api/profile/education/:edu_id
  // @desc     Delete education from profile
  // @access   Private
  
  router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
      const foundProfile = await Profile.findOne({ user: req.user.id });
      foundProfile.education = foundProfile.education.filter(
        edu => edu._id.toString() !== req.params.edu_id
      );
      await foundProfile.save();
      return res.status(200).json(foundProfile);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: 'Server error' });
    }
  });

  // @route    GET api/profile/github/:username
// @desc     Get user repos from Github
// @access   Public
router.get('/github/:username', async (req, res) => {
    try {
        const options = {
            uri:"https://api.github.com/users/"+req.params.usrname+"/repos?per_page=5&sort=created:asc&client_id="
            +config.get('githubClientId')+"&client_secret="+config.get('githubClientSecret'),
            method:'GET',
            headers:{'user-agent':'node.js'}
        };
        request(options,(error,response,body)=>{
        if(error)console.log(error);
        if(response.statusCode!==200)
        return res.status(404).json({msg:"No Github Profile Found"});
        res.json(JSON.parse(body));
    })
        
      

    } catch (err) {
      console.error(err.message);
      return res.status(404).json({ msg: 'No Github profile found' });
    }
  });
  
  module.exports = router;