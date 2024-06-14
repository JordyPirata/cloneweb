import React from 'react';

const typesOfUsers = [
    { value: 'admin', label: 'Administrador' },
    { value: 'specialist', label: 'Especialista' },
    { value: 'repairman', label: 'RescueRepair' },
    { value: 'user', label: 'Cliente' }
];

const UserTypeLabel = ({ userType }) => {
    const userTypeLabel = typesOfUsers.find(type => type.value === userType)?.label;

    return (<a className='text-red-400'>{userTypeLabel}</a>
    );
};

export default UserTypeLabel;
