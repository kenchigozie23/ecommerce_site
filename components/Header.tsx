import {MouseEvent} from 'react';
import Link from 'next/link';
import HeaderCart from './cart/HeaderCart';
import ChooseVariantModal from './header/ChooseVariantModal';
import logoImg from '../assets/andrax.png';
import {faBars} from '@fortawesome/free-solid-svg-icons/faBars';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useAppDispatch} from '../hooks/redux';
import {setIsOpened} from '../redux/reducers/asideMenu';
import { useSession, signIn, signOut } from "next-auth/react";

export default function Header({companyTitle}: {companyTitle?: string}) {
    const dispatch = useAppDispatch();
    const { data: session } = useSession();

    const onHamburgerBtnClicked = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        dispatch(setIsOpened(true));
    };

    const title = companyTitle || 'KNAS & ESCCAY TECH TRADING:';

    const buttonStyles = {
        border: '2px solid teal',
        color: 'teal',
        padding: '8px 16px',
        borderRadius: '4px',
        backgroundColor: 'transparent',
        marginRight: '1rem',
				
        fontWeight: '500',
        transition: 'all 0.2s ease',
        cursor: 'pointer'
    };

    const handleMouseOver = (e: MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.backgroundColor = 'teal';
        e.currentTarget.style.color = 'white';
    };

    const handleMouseOut = (e: MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.color = 'teal';
    };

    return (
        <header className='page-header'>
            <div className='container'>
                <div className='page-header__content'>
                    <div className='page-header__logo'>
                        <Link href='/'>
                            <img src={logoImg.src} width={110} height={80} alt={title} />
                        </Link>
                    </div>
                    <div className={'page-header__right-blocks'}>
                        {session ? (
                            <div className="flex items-center">
                                <span className="mr-2 text-sm">{session.user?.email}</span>
                                <button
                                    type="button"
                                    className="btn sign-out-btn"
                                    style={buttonStyles}
                                    onClick={() => signOut()}
                                    onMouseOver={handleMouseOver}
                                    onMouseOut={handleMouseOut}
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                className="btn sign-in-btn"
                                style={buttonStyles}
                                onClick={() => signIn()}
                                onMouseOver={handleMouseOver}
                                onMouseOut={handleMouseOut}
                            >
                                Sign In
                            </button>
                        )}
                        <HeaderCart />
                        <button type={'button'}
                                className={'btn btn-outline-secondary page-header__hamburger'}
                                onClick={onHamburgerBtnClicked}
                        >
                            <FontAwesomeIcon icon={faBars} />
                        </button>
                    </div>
                </div>
            </div>
            <ChooseVariantModal />
        </header>
    );
}
