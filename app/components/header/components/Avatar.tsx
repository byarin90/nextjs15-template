"use client";
import Image from 'next/image';
import React from 'react'

const Avatar = ({ src }: {
    src: string
}) => {
    return (
        <>
            {src &&
                <div className='w-[2.5rem] h-[2.5rem] rounded-full shadow-lg  border-[1px] border-gray-300 dark:border-white' >
                    <Image
                        width={100}
                        height={100}
                        src={src}
                        className="w-32 rounded-full"
                        alt="Avatar" />
                </div>
            }
        </>
    )
}

export default Avatar