import React from 'react';
import styles from './UserInfo.module.scss';


export const UserInfo = ({ avatarUrl, fullName, additionalText , _id, handleFriendClick}) => {



  return (
    <div className={styles.root}>
      <img className={styles.avatar} 
       onClick={() => handleFriendClick(_id)}
      
      src={ `${process.env.REACT_APP_API_URL}${avatarUrl}` || '/noavatar.png'} alt={fullName}   />
      <div className={styles.userDetails}>
        <span className={styles.userName}>{fullName}</span>
        <span className={styles.additional}>{additionalText}</span>
      </div>
    </div>
  );
};
