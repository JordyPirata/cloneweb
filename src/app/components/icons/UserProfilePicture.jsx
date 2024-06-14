import React from "react";

const UserProfilePicture = ({ size = 24, color = "currentColor", ...props }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M12 2C7 2 3 6 3 11v2a5 5 0 0 0 5 5h8a5 5 0 0 0 5-5v-2c0-5-4-9-9-9z"></path>
            <circle cx="12" cy="10" r="3"></circle>
        </svg>
    );
};

export default UserProfilePicture;
