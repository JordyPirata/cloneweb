import { fetchUsers } from '@/app/lib/firebase/firebase';
import { Button, Image } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';

function UserList({ onClicked }) {
    const [usersData, setUsersData] = useState([]);
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const users = await fetchUsers();
                console.log('Users data:', users);
                setUsersData(users);
            } catch (error) {
                console.error('Error fetching users data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleEditUser = (user) => {
        onClicked(user);
    }

    return (
        <div className="container mx-auto mt-8">
            <h1 className="text-2xl font-semibold mb-4 text-center">Lista de Usuarios</h1>
            <ul className="divide-y divide-gray-200">
                {usersData.map((user, index) => (
                    <li key={index} className="py-4">
                        <div className="flex items-center gap-2">
                            <Image
                                src={user.data.profilePicture ? user.data.profilePicture : "/UserProfilePicture.svg"}
                                alt={user.data.name || user.data.email}
                                isBlurred={true}
                                className="h-10 w-10 rounded-full border-gray-200 border-2"
                            />
                            <div className="ml-4">
                                <p className="text-lg font-semibold">{user.data.name}</p>
                                <p className="text-gray-500">{user.data.email}</p>
                            </div>
                            <Button className="ml-auto" onClick={() => handleEditUser(user)}>Editar</Button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default UserList
