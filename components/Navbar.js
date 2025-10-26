"use client";

import Link from "next/link";
import { useContext } from 'react';
import { UserContext } from '../lib/context';
import SafeImage from './SafeImage';

export default function Navbar(){
    const { user, username } = useContext(UserContext)

    return(
        <nav className="navbar">
            <ul>
                <li>
                    <Link href="/">
                        <button className="btn-logo">NEXTSHIP</button>
                    </Link>
                </li>

                {/* when user is signed in*/}
                { user && (
                    <>
                        <li className="push-left">
                            <Link href="/enter">
                                <button className="btn-blue">Enter</button>
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin">
                                <button className="btn-blue">Admin</button>
                            </Link>
                        </li>
                        <li>
                            <Link href={username ? `/${username}` : '/enter'}>
                                <SafeImage 
                                    src={user?.photoURL} 
                                    alt="Profile" 
                                    width={40} 
                                    height={40}
                                    style={{ borderRadius: '50%', cursor: 'pointer' }}
                                />
                            </Link>
                        </li>
                    </>
                )}

                {/* when user is not signed in*/}
                { !user && (
                    <li>
                        <Link href="/enter">
                          <button className="btn-blue">Log In</button>
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
}