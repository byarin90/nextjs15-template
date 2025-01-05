"use client";
import Image from 'next/image';
import React from 'react'

const Avatar = ({ src }: {
    src: string
}) => {
    return (
        <>
            {src &&
                <div className='w-10 h-10 border-white border-2 rounded-full dark:border-gray-800'>
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