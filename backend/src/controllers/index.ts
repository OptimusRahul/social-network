// EXPORT AUTH CONTROLLER
export { fogotPassword, login, logout, resetPassword, signUp, updatePassword } from './auth/auth.controller';

// EXPORT USER CONTROLLER
export { getAllUsers, getUser, deleteFriend, deleteUser, updateUser } from './user/user.controller';

// EXPORT FRIEND REQUEST CONTROLLER
export { acceptFriendRequest, deleteFriendRequest, getRecievedFriendRequest, getSentFriendRequest, sendFriendRequest } from './friend-request/friend.request.controller';

// EXPORT NOTIFICATION CONTROLLER
export { createNotification, getNotification } from './notfication/notification.controller';

// EXPORT POST CONTROLLER
export { createPost, deletePost, getAllPosts, getPost, updatePost } from './post/post.controller';

// EXPORT REACTION CONTROLLER
export { reactionController } from './reaction/reaction.controller';

// EXPORT COMMENT CONTROLLER
export { createComment, deleteComment, updateComment } from './comment/comment.controller';

// EXPORT FEEDS CONTROLLER
export { feedsController, profileViewController } from './feeds/feed.controller';