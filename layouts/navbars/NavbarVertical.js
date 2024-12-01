'use client';
// Import required modules
import { Fragment, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMediaQuery } from 'react-responsive';
import { ListGroup, Card, Image, Badge } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import AccordionContext from 'react-bootstrap/AccordionContext';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import { DashboardMenu as OriginalMenu } from 'routes/DashboardRoutes';

const NavbarVertical = (props) => {
    const router = useRouter();
    const location = usePathname();
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const [DashboardMenu, setDashboardMenu] = useState([]); // State for menu
    const allowedRoutes = [
        '/',
        '/pages/users',
        '/pages/profile',
        '/pages/orders',
        '/pages/inquiries',
        '/pages/products',
        '/pages/products/inventory',
        '/pages/products/files',
        '/pages/settings',
        '/authentication/sign-in',
        '/authentication/sign-up',
        '/authentication/forget-password',
    ];

    useEffect(() => {
        // Retrieve currentUser from localStorage
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if (!currentUser || !allowedRoutes.includes(location)) {
            router.push('/authentication/sign-in'); // Redirect to sign-in if unauthorized
        }

        // Modify DashboardMenu based on role_id
        if (currentUser?.role_id === 3) {
            // Filter out "Users" from menu for role_id === 2
            const updatedMenu = OriginalMenu.filter(
                (menu) => menu.link !== '/pages/users'
            );
            setDashboardMenu(updatedMenu);
        } else {
            setDashboardMenu(OriginalMenu); // Use default menu for other roles
        }
    }, [router, location]);

    const handleNavigation = (link) => {
        if (isMobile) {
            props.onClick(!props.showMenu);
        }
        router.push(link);
    };

    const CustomToggle = ({ children, eventKey, icon }) => {
        const { activeEventKey } = useContext(AccordionContext);
        const decoratedOnClick = useAccordionButton(eventKey);
        const isCurrentEventKey = activeEventKey === eventKey;
        return (
            <li className="nav-item">
                <Link
                    href="#"
                    className="nav-link"
                    onClick={decoratedOnClick}
                    data-bs-toggle="collapse"
                    aria-expanded={isCurrentEventKey}
                >
                    {icon ? <i className={`nav-icon fe fe-${icon} me-2`}></i> : ''}{' '}
                    {children}
                </Link>
            </li>
        );
    };

    const generateLink = (item) => (
        <div
            className={`nav-link ${location === item.link ? 'active' : ''}`}
            onClick={() => handleNavigation(item.link)}
            style={{ cursor: 'pointer' }}
        >
            {item.name || item.title}
            {item.badge && (
                <Badge
                    className="ms-1"
                    bg={item.badgecolor ? item.badgecolor : 'primary'}
                >
                    {item.badge}
                </Badge>
            )}
        </div>
    );

    return (
        <Fragment>
            <SimpleBar style={{ maxHeight: '100vh' }}>
                <div className="nav-scroller">
                    <div
					style={{
						color: "#ffffff",
						fontSize: "24px",
						fontWeight: 600,
						fontFamily: "sans-serif",
						textAlign: "center"
					}}
                        className="navbar-brand"
                        onClick={() => handleNavigation('/')}
                    >
                        Horo Collect
                    </div>
                </div>
                <Accordion defaultActiveKey="0" as="ul" className="navbar-nav flex-column">
                    {DashboardMenu.map((menu, index) => {
                        if (menu.grouptitle) {
                            return (
                                <Card bsPrefix="nav-item" key={index}>
                                    <div className="navbar-heading">{menu.title}</div>
                                </Card>
                            );
                        } else if (menu.children) {
                            return (
                                <Fragment key={index}>
                                    <CustomToggle eventKey={index} icon={menu.icon}>
                                        {menu.title}
                                        {menu.badge && (
                                            <Badge
                                                className="ms-1"
                                                bg={menu.badgecolor ? menu.badgecolor : 'primary'}
                                            >
                                                {menu.badge}
                                            </Badge>
                                        )}
                                    </CustomToggle>
                                    <Accordion.Collapse eventKey={index} as="li" bsPrefix="nav-item">
                                        <ListGroup as="ul" bsPrefix="" className="nav flex-column">
                                            {menu.children.map((menuItem, menuIndex) => (
                                                <ListGroup.Item key={menuIndex} as="li" bsPrefix="nav-item">
                                                    {generateLink(menuItem)}
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    </Accordion.Collapse>
                                </Fragment>
                            );
                        } else {
                            return (
                                <Card bsPrefix="nav-item" key={index}>
                                    <div
                                        className={`nav-link ${location === menu.link ? 'active' : ''}`}
                                        onClick={() => handleNavigation(menu.link)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <i className={`nav-icon fe fe-${menu.icon} me-2`}></i>
                                        {menu.title}
                                    </div>
                                </Card>
                            );
                        }
                    })}
                </Accordion>
            </SimpleBar>
        </Fragment>
    );
};

export default NavbarVertical;