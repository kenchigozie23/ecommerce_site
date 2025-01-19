import React, { MouseEvent } from 'react';
import Link from 'next/link';
import HeaderCart from './cart/HeaderCart';
import ChooseVariantModal from './header/ChooseVariantModal';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch } from '../hooks/redux';
import { setIsOpened } from '../redux/reducers/asideMenu';
import logoImg from '../assets/andrax.png';
import { useSession, signIn, signOut } from "next-auth/react";

// Add styles with a style tag
const styles = `
  /* Header Container */
  .page-header {
    background-color: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .page-header__content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 5rem;
  }

  /* Logo */
  .page-header__logo {
    flex-shrink: 0;
  }

  .page-header__logo img {
    height: auto;
    width: 110px;
    transition: width 0.3s ease;
  }

  /* Right Side Content */
  .page-header__right-blocks {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  /* User Info */
  .user-email {
    font-size: 0.875rem;
    color: #4a5568;
    margin-right: 1rem;
  }

  /* Button Styles */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1rem;
    border: 2px solid teal;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .sign-in-btn,
  .sign-out-btn {
    background-color: transparent;
    color: teal;
  }

  .sign-in-btn:hover,
  .sign-out-btn:hover {
    background-color: teal;
    color: white;
  }

  .sign-in-btn:active,
  .sign-out-btn:active {
    background-color: #006666;
    border-color: #006666;
  }

  .sign-in-btn:focus,
  .sign-out-btn:focus {
    outline: none;
    box-shadow: 0 0 0 2px white, 0 0 0 4px teal;
  }

  /* Hamburger Button */
  .page-header__hamburger {
    padding: 0.5rem;
    border: none;
    background: transparent;
    color: #4a5568;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .page-header__hamburger:hover {
    color: #1a202c;
    background-color: #f7fafc;
  }

  .page-header__hamburger:focus {
    outline: none;
    box-shadow: 0 0 0 2px white, 0 0 0 4px teal;
  }

  /* Responsive Styles */
  @media (max-width: 768px) {
    .container {
      padding: 0 0.5rem;
    }

    .page-header__content {
      height: 4rem;
    }

    .page-header__logo img {
      width: 90px;
    }

    .btn {
      padding: 0.375rem 0.75rem;
      font-size: 0.813rem;
    }

    .user-email {
      display: none;
    }

    .page-header__right-blocks {
      gap: 0.5rem;
    }
  }

  @media (max-width: 480px) {
    .page-header__logo img {
      width: 80px;
    }

    .btn {
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
    }
  }

  /* Focus and Accessibility */
  @media (prefers-reduced-motion: reduce) {
    .btn,
    .page-header__logo img,
    .page-header__hamburger {
      transition: none;
    }
  }
`;

export default function Header({ companyTitle }: { companyTitle?: string }) {
    const dispatch = useAppDispatch();
    const { data: session } = useSession();

    const onHamburgerBtnClicked = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        dispatch(setIsOpened(true));
    };

    const title = companyTitle || 'KNAS & ESCCAY TECH TRADING:';

    // Add style tag to the document
    React.useEffect(() => {
        const styleSheet = document.createElement("style");
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);

        return () => {
            document.head.removeChild(styleSheet);
        };
    }, []);

    return (
        <header className="page-header">
            <div className="container">
                <div className="page-header__content">
                    <div className="page-header__logo">
                        <Link href="/">
                            <img src={logoImg.src} width={110} height={80} alt={title} />
                        </Link>
                    </div>
                    <div className="page-header__right-blocks">
                        {session ? (
                            <div className="user-section">
                                <span className="user-email">{session.user?.email}</span>
                                <button
                                    type="button"
                                    className="btn sign-out-btn"
                                    onClick={() => signOut()}
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                className="btn sign-in-btn"
                                onClick={() => signIn()}
                            >
                                Sign In
                            </button>
                        )}
                        <HeaderCart />
                        <button
                            type="button"
                            className="page-header__hamburger"
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
