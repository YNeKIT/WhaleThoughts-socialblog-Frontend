import React, { useState, useEffect } from "react";
import clsx from "clsx";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import EyeIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import CommentIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import styles from "./Post.module.scss";
import { UserInfo } from "../UserInfo";
import { PostSkeleton } from "./Skeleton";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addCommentToPost,
  toggleLikePost,
  fetchPosts,
} from "../../redux/slices/posts";
import { selectUserData } from "../../redux/slices/auth"; // Import fetchPostById action
import FavoriteIcon from "@mui/icons-material/Favorite";
export const Post = ({
  id,
  title,
  likes = [],
  createdAt,
  imageUrl,
  user,
  viewsCount,
  comments = [],
  tags = [],
  isFullPost,
  isLoading,
  isEditable,
}) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [localComments, setLocalComments] = useState(comments);
  const userData = useSelector(selectUserData);
  // Fetch user data
  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  const handleToggleComments = () => {
    setShowComments(!showComments);
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      const action = await dispatch(
        addCommentToPost({ postId: id, commentText, token })
      );
      if (addCommentToPost.fulfilled.match(action)) {
        setLocalComments([...localComments, action.payload.comment]);
        // Fetch the post again to update the comments list
        dispatch(fetchPosts());
      }
      setCommentText(""); // Clear the input after adding the comment
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleToggleLike = () => {
    dispatch(toggleLikePost({ postId: id }));
  };

  const onClickRemove = () => {
    // Implement delete post logic if needed
  };

  if (isLoading) {
    return <PostSkeleton />;
  }

  const userHasLiked = likes.some((like) => like === userData?._id);
 
  return (
    <div className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
      {isEditable && (
        <div className={styles.editButtons}>
          <Link to={`/posts/${id}/edit`}>
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton onClick={onClickRemove} color="secondary">
            <DeleteIcon />
          </IconButton>
        </div>
      )}
      {imageUrl && (
        <img
          className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
          src={imageUrl}
          alt={title}
        />
      )}
      <div className={styles.wrapper}>
        <UserInfo {...user} additionalText={createdAt} />
        <div className={styles.indention}>
          <h2
            className={clsx(styles.title, { [styles.titleFull]: isFullPost })}
          >
            {isFullPost ? title : <Link to={`/posts/${id}`}>{title}</Link>}
          </h2>
          <ul className={styles.tags}>
            {tags.map((name, index) => (
              <li key={`${name}-${index}`}>
                <Link to={`/tag/${name}`}>#{name}</Link>
              </li>
            ))}
          </ul>
          <ul className={styles.postDetails}>
            <li>
              {userHasLiked ? (
                <FavoriteIcon
                  className={styles.heart}
                  onClick={handleToggleLike}
                />
              ) : (
                <FavoriteBorderIcon
                  className={styles.heart}
                  onClick={handleToggleLike}
                />
              )}
              <span>{likes.length}</span>
            </li>
            <li>
              <EyeIcon />
              <span>{viewsCount}</span>
            </li>
            <li>
              <CommentIcon
                className={styles.CommentIcon}
                onClick={handleToggleComments}
              />
              <span>{localComments.length}</span>
            </li>
          </ul>
        </div>
      </div>

      <div
        className={clsx(styles.commentInput, {
          [styles.commentInputVisible]: showComments,
        })}
      >
        <textarea
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button onClick={handleAddComment}>Post</button>
      </div>

      {showComments && (
        <div className={styles.commentsSection}>
          {localComments.map((comment, index) => (
            <div
              key={comment._id || `${index}-${comment.text}`}
              className={styles.comment}
            >
              <img
                src={`http://localhost:4444${comment.user.avatarUrl}`}
                alt={comment.user.fullName}
                className={styles.commentUserAvatar}
              />
              <div>
                <div className={styles.commentUserName}>
                  {comment.user.fullName}
                </div>
                <div className={styles.commentText}>{comment.text}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
