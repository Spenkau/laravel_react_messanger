import React from 'react';
import {Link} from "@inertiajs/react";

export default function ProfilePictureOnChat({entity}) {
    const roundClasses = 'inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-700';

    return (
        <>
            <Link as="button" href={route('profile.edit')}>
                <div className="inline-block relative">
                    {
                        entity instanceof Array
                            ? <img src={entity[0]} className={roundClasses} />
                            :
                            <span className={roundClasses}>
                                <span className="font-medium leading-none text-white">
                                    {entity.name.charAt(0).toUpperCase()}
                                </span>
                            </span>

                    }
                    {/*<span className="absolute bottom-0 right-0.5 block h-2 w-2 rounded-full ring-2 ring-gray-200 bg-green-500"/>*/}
                </div>
            </Link>
        </>
    )
}
