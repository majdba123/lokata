import Pusher from 'pusher-js';
import React, { useEffect, useState } from 'react'

const Mytemp = () => {
    const [data, setData] = useState();
    useEffect(() => {
        const pusher = new Pusher('ce6d0e93bf8792c34737', {
            cluster: 'eu',
            authEndpoint: '/pusher/auth', // updated endpoint
            auth: {
                params: {
                    userId: '1' // pass the user ID to the auth endpoint
                }
            }
        });

        const channel = pusher.subscribe('chat-private-channel-1');
        channel.bind('Private_chat', function (data) {
            setData(data)
            alert(JSON.stringify(data));
        });
    })
    return (
    <div>
        <h1>DATA</h1>
        {data}
    </div>
    )

}

export default Mytemp