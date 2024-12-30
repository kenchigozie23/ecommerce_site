import Link from 'next/link';
import logoImg from '../../assets/andrax.png';

export default function FooterAbout({companyTitle}: {companyTitle?: string}) {
	const title = companyTitle || 'KNAS & ESCCAY TECH TRADING';
	return <>
        <div className='page-footer__logo'>
					<Link href='/'>
						<img src={logoImg.src} width={110} height={100} alt={title} />
					</Link>
        </div>
        <div className='page-footer__company-info'>
            <p className='title'>{title}</p>
        </div>
        <div className='page-footer__disclaimer'>
            <p className='text-muted small'>
						Welcome to our go-to destination for premium accessories that enhance your digital lifestyle. From cutting-edge tech gadgets to stylish, functional add-ons, we offer a curated selection of products designed to complement your devices and simplify your life.
            </p>
        </div>
    </>;
}