import express from 'express'
import { auth } from '../middleware/auth.middleware.js';
import {upload} from '../service/multer.js';
const router=express.Router();
import { sendmessage,getmessage } from '../controller/message.controller.js';
import {
  login,
  register,
  editprofile,
  updateProfile,
  bookmark,
  getprofile,
  getothersprofile,
  getbookmark,
  getsuggested,
  uploadpost,
  comment,
  getallpost,
  likeorunlike,
  followorunfollow,
  getpostcontent,
  getcomments,
  deletecomment,
  deletepost,
  getUser,
  getMentors,
  connectGitHub,
  disconnectGitHub,
  getGitHubRepos
} from '../controller/user.controller.js';
import {
  getFollowRequests,
  getFollowing,
  acceptFollowRequest,
  rejectFollowRequest,
  sendFollowRequest,
  cancelFollowRequest,
  checkUnreadMessages,
  markMessagesAsRead
} from '../controller/follow.controller.js';
router.post('/register',register)
router.post('/login',login)
router.post('/editprofile',auth,upload.single('profile'),editprofile)
router.post('/update-profile',auth,upload.single('profile'),updateProfile)
router.get('/getprofile',auth,getprofile)
router.get('/getothersprofile/:username',getothersprofile)
router.post('/uploadpost',auth,upload.single('image'),uploadpost)
// Keeping this for backward compatibility, but new code should use /comment/add
router.post('/addcomment/:post',auth,comment)
router.get('/like/:post',auth,likeorunlike)
router.get('/followorunfollow/:targetid',auth,followorunfollow)
router.get('/getpost',auth,getpostcontent)
// Keeping this for backward compatibility, but new code should use /comment/:postId
router.get('/getcomments/:postid',getcomments)
router.post('/deletecomment/:commentid',deletecomment)
router.get('/deletepost/:postid',deletepost)
router.get('/getallpost',auth,getallpost)
router.get('/getsuggested',auth,getsuggested)
router.get('/bookmark/:postid',auth,bookmark)
router.get('/getbookmarks',auth,getbookmark)
router.post('/sendmessage/:receiverId',auth,sendmessage)
router.get('/getmessages/:receiverId',auth,getmessage)
router.get('/mentors', getMentors)
router.get('/:id', getUser)

// GitHub integration routes
router.post('/connect-github', auth, connectGitHub)
router.post('/disconnect-github', auth, disconnectGitHub)
router.get('/github-repos', auth, getGitHubRepos)
router.get('/github-repos/:userId', getGitHubRepos)
router.get('/refresh-github', auth, (req, res) => {
  req.query.refresh = 'true';
  return getGitHubRepos(req, res);
})

// Follow request routes
router.get('/getfollowrequests', auth, getFollowRequests);
router.get('/getfollowing', auth, getFollowing);
router.post('/acceptfollow/:requestId', auth, acceptFollowRequest);
router.post('/rejectfollow/:requestId', auth, rejectFollowRequest);
router.post('/sendfollow/:targetId', auth, sendFollowRequest);
router.post('/cancelfollow/:targetId', auth, cancelFollowRequest);

// Message notification routes
router.get('/unreadmessages', auth, checkUnreadMessages);
router.post('/markread', auth, markMessagesAsRead);

export default router