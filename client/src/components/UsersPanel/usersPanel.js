import React from 'react';

export default (users) => (
    <div>
        <h3>Users Connected</h3>
        <ul>
            {
               users.map((user) => (
                <li key = {user.id} >{user.name}</li>
               ))
            }
        </ul>
    </div>
)